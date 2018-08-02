/**
 * Created: 7/19/16.
 * Refactor: 07/23/2018
 * Notes:
 *   - Create thunks
 *   - Split them up into throttled chunks (in order to throttle the promise executions (of image resizes))
 */

'use strict';

const
    fs = require('fs'),
    {log, error, peek, assign, concat} = require('fjl'),
    {promisify, inspect} = require('util'),
    path = require('path'),
    mkdirp = promisify(require('mkdirp')),
    imageMagickStream = require('imagemagick-stream'),
    imageSize = require('image-size'),
    rpiUtils = require('./utils'),

    // IO processes
    ioImageSize = promisify(imageSize),
    ioReadDirectory = promisify(fs.readdir),
    ioDoesFilePathExists = promisify(fs.access),
    ioStat = promisify(fs.stat),
    ioWriteFile = promisify(fs.writeFile),

    // Options
    _subPortfolioSuffix = '', // sub folder where actual images are kept (default blank)
    _allowedImagesRegex = /\.(jpg|jpeg|png)$/i,
    _targetImageWidths = rpiUtils.fib(89, 1000),

    _defaultOptions = {
        inputPathPrefix: '',
        outputPathPrefix: '',
        subPortfolioSuffix: _subPortfolioSuffix,
        allowedImagesRegex: _allowedImagesRegex,
        targetImageWidths: _targetImageWidths,
        testFixtureName: 'generated-test-fixture.json'
    },

    // External options
    {refreshPortfolioImagesConfig} = require('../../package'),

    // Overall options to use
    incomingOptions = assign(_defaultOptions, refreshPortfolioImagesConfig),

    /**
     * @param inputPath {String}
     * @param outputPath {String}
     * @param subPortfolioSuffix {String}
     * @param allowedImagesRegex {RegExp}
     * @param targetImageWidths {Array.<Number>}
     */
    processPortfoliosDirectory = ({
      inputPathPrefix: inputPath, outputPathPrefix: outputPath,
      subPortfolioSuffix, allowedImagesRegex, targetImageWidths
    }) => {
        ioReadDirectory(inputPath).then(files => Promise.all(
            files.map(file => {
                let filePath = path.join(inputPath, file, subPortfolioSuffix),
                    fileOutputPath = path.join(outputPath, file, subPortfolioSuffix);
                return ioStat(filePath).then(fileStats => {
                    if (!fileStats.isDirectory()) {
                        log(`Skipping ${filePath}.  Only directories allowed directly in 'portfolios' folder`);
                        return ['', '', Promise.resolve([])];
                    }
                    return ensureOutputPath(fileOutputPath).then(() => [
                            filePath,
                            fileOutputPath,
                            toImagesAssocList(filePath, fileOutputPath, allowedImagesRegex, targetImageWidths)
                        ]);
                });
            })))

            // Flip `Array.<String, String, Promise>` to `Promise.<Array.<String, String, Array>>`
            .then(dirTuplesList => Promise.all(
                dirTuplesList.filter(([originalFilePath]) => Boolean(originalFilePath))
                    .map(([filePath, fileOutputPath, ioImageConfigs]) =>
                        ioImageConfigs.then(xs => [filePath, fileOutputPath, xs]))
                )
            )

            // Concat results for each portfolio directory into one list of tuples
            .then(dirTuplesList => concat(
                dirTuplesList.map(([filePath, fileOutputPath, xs]) => xs)
            ))

            // Run resize for each each image and image-configs set
            .then(reduceImageListTuples)

            // ----
            // Output image list for testing and reference
            // .then(JSON.stringify.bind(JSON))
            // .then(compose(peek, JSON.stringify.bind(JSON)))
            // .then(json => ioWriteFile(path.join(__dirname, incomingOptions.testFixtureName), json))
            .catch(error);
    },

    ensureOutputPath = outputPath =>
        ioDoesFilePathExists(outputPath)
            .then(() => `${outputPath} already exists not creating the path.`)
            .catch(() =>
                mkdirp(outputPath)
                    .then(() => `Directory file path created for path: ${outputPath}`)
                    .catch(err => `Error creating \`${outputPath}\`;  Error: ${err}`)
            ),

    toImagesAssocList = (fileInputPathPrefix, fileOutputPathPrefix, allowedImagesRegex, targetImageWidths) => {
        log(`\nGenerating images associated list for ${fileInputPathPrefix}...\n`);
        return ioReadDirectory(fileInputPathPrefix).then(files => Promise.all(
            files.map(file => {
                const fileInputPath = path.join(fileInputPathPrefix, file);
                return ioStat(fileInputPath).then(fileStats => {
                    if (!fileStats.isFile() || !allowedImagesRegex.test(fileInputPath)) {
                        log(`\nSkipping: ${fileInputPath}`);
                        return Promise.resolve([fileInputPath, []]);
                    }
                    return ioImageSize(fileInputPath)
                      .then(({type, width, height}) => [
                        fileInputPath,
                        targetImageWidths.map(targetWidth => ({
                                parentDirectory: fileInputPathPrefix,
                                originalFilePath: fileInputPath,
                                newWidth: targetWidth,
                                newHeight: rpiUtils.ratio(width, height, targetWidth),
                                newFilePath: path.join(fileOutputPathPrefix,
                                    path.basename(file, `.${type}`) +
                                  `-${targetWidth }.${type}`
                                )
                            }))
                      ])
                });
            })))
            .catch(error)
    },

    reduceImageListTuples = imageListTuples =>
        imageListTuples.reduce((prevPromise, [originalFilePath, imageConfigs]) => {
            const readStream = fs.createReadStream(path.resolve(originalFilePath));
            return prevPromise.then(() => Promise.all( // Chain all image sets together to
                                                       //   only allow one `read stream` to be loaded per image set
                imageConfigs.map(c => new Promise((resolve, reject) => {
                    const {newWidth, newHeight, newFilePath} = c,
                        resize = imageMagickStream().resize(newWidth + 'x' + newHeight),
                        writeStream = fs.createWriteStream(path.resolve(newFilePath));

                    // Resize image
                    readStream
                        .pipe(resize)
                        .pipe(writeStream)
                        .on('error', reject)
                        .on('finish', err => {
                            const out = {};
                            if (err) {
                                log(err);
                                out.failed = true;
                                out.error = err;
                            }
                            resolve({...out, ...c});
                        });
                }))
            ));
        }, Promise.resolve())

;

processPortfoliosDirectory(incomingOptions);

/* SUDO
Read portfolios directory
    Map over portfolio directories
        Read portfolio directory
            Map over images in portfolio directory
                Create thunk for each required image size
            Aggregate thunks onto thunk stack
        Aggregate portfolio dir thunk array
    Aggregate thunks array
    Divide thunk array into chunks
    For each in chunks
      Execute chunk
*/
