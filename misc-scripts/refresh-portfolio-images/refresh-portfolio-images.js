/**
 * Created: 7/19/16.
 * Refactored: 07/23/2018
 * @description Generates thumbs for images in 'portfolios-pending' folder (see '../../package.json' `refreshPortfolioImagesConfig` key)
 * @todo Add more thorough description of this script, document functions and add comments where useful.
 * @todo Add command line flag for forcing the rewrite of already generated images.
 * @todo Make script runnable from any directory (currently script doesn't access paths relatively).
 */

const
    fs = require('fs'),
    path = require('path'),
    {log, error, assign, concatMap, concat, peek} = require('fjl'),
    {ensureOutputPath, ioReadDirectory, ioStat, ioImageSize,
        ioDoesFilePathExists} = require('../utils/utils'),
    imageMagickStream = require('imagemagick-stream'),
    rpiUtils = require('./utils'),

    // Options
    _subPortfolioSuffix = '', // sub folder where actual images are kept (default blank)
    _allowedImagesRegex = /\.(jpg|jpeg|png|tif|tiff)$/i,
    _targetImageWidths = rpiUtils.fib(89, 2560),

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

    // Get command line args
    {argv: { force }} = require('yargs')
        .default('force', false)
        .alias('f', 'force'),

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
            .then(dirTuplesList => concatMap(
                    ([filePath, fileOutputPath, xs]) => xs,
                    dirTuplesList
                )
            )

            // Run resize for each each image and image-configs set
            .then(reduceImageListTuples)

            // ----
            // Output image list for testing and reference
            // .then(JSON.stringify.bind(JSON))
            // .then(compose(peek, JSON.stringify.bind(JSON)))
            // .then(json => ioWriteFile(path.join(__dirname, incomingOptions.testFixtureName), json))
            .catch(error);
    },

    toImagesAssocList = (fileInputPathPrefix, fileOutputPathPrefix, allowedImagesRegex, targetImageWidths) => {
        log(`\nGenerating images associated list for ${fileInputPathPrefix}...\n`);
        log(`\nImages already processed will be skipped (if overwriting ` +
            `is required pass in '-f' or '--force' when calling the script)\n`);
        return ioReadDirectory(fileInputPathPrefix).then(files => Promise.all(
            files.map(file => {
                const fileInputPath = path.join(fileInputPathPrefix, file);
                return ioStat(fileInputPath).then(fileStats => {
                    if (!fileStats.isFile() || !allowedImagesRegex.test(fileInputPath)) {
                        log(`\nSkipping: ${fileInputPath}`);
                        return Promise.resolve([fileInputPath, []]);
                    }

                    log(`\nGenerating resize configs for "${fileInputPath}"`);

                    // Get image dimensions
                    return ioImageSize(fileInputPath)

                    // Then create image configurations; I.e., `[FilePath, [ResizeConfigs]]`
                      .then(({type, width, height}) => [
                        fileInputPath,

                        // Loop through expected image width sizes and create config entries
                          // for each image size requested
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
                        // Check if image overwrites are required
                        .then(([_, entries]) => {
                            //
                            if (!force) {
                                log (`Skipping: "${_}"`);

                                // If overwrites are to be skipped filter `entries` by `newFilePath`s that do not exist
                                return [_, Promise.all(entries.map(entry =>
                                    ioDoesFilePathExists(entry.newFilePath)
                                        .then(() => null)   // File path exists.  Mark it `null`/'should-be-skipped'
                                        .catch(() => entry) // File path doesn't exist.  Leave it marked for processing.
                                    ))
                                    .then(_entries => _entries.filter(Boolean)) // Filter for entries that should be included
                                ];
                            }

                            // Message user
                            if (!entries.length) {
                                log (`\nNo images matching extensions ${_allowedImagesRegex.toString()} for resize found for directory ${_}.\n`);
                            } else {
                                log (`\nAssociated image configs list generated for ${_}.\n`);
                            }

                            // Else leave all config entries in `entries` list (overwrite/`--force` was requested)
                            return [_, Promise.resolve(entries)];
                        })

                        // Flip promises inside out;  I.e., `[String, Promise<Array>] -> Promise<[String, Array]>`
                        .then(([_, p]) => p.then(entries => [_, entries]))
                });
            })))
            .catch(error)
    },

    reduceImageListTuples = imageListTuples =>
        imageListTuples.reduce((prevPromise, [originalFilePath, imageConfigs]) => {

            // Chain all image sets together to only allow
            //  one `read stream` to be loaded per image set
            return prevPromise.then(() => {
                log (`\nPerforming resizes for ${originalFilePath}...`);
                const readStream = fs.createReadStream(path.resolve(originalFilePath));
                return Promise.all(
                    imageConfigs.map(c => new Promise((resolve, reject) => {
                        const {newWidth, newHeight, newFilePath} = c,
                            resolvedNewFilePath = path.resolve(newFilePath),
                            resize = imageMagickStream().resize(newWidth + 'x' + newHeight),
                            writeStream = fs.createWriteStream(resolvedNewFilePath);

                        // Resize image
                        readStream
                            .pipe(resize)
                            .pipe(writeStream)
                            .on('error', reject)
                            .on('finish', err => {
                                const out = {};
                                if (err) {
                                    log(`\nFile generation failed for file ${resolvedNewFilePath}. ${err}`);
                                    out.failed = true;
                                    out.error = err;
                                }
                                log(`\nFile generated successfully: ${resolvedNewFilePath}`);
                                resolve({...c, ...out});
                            });
                    }))
                );
            });
        }, Promise.resolve())
            .then(() => {
                log('\nResize processing completed.\n');
            })
            .catch(error)

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
