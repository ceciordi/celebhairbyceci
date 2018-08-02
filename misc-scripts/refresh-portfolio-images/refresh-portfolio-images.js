/**
 * Created: 7/19/16.
 * Refactor: 07/23/2018
 * Notes:
 *   - Create thunks
 *   - Split them up into throttled chunks (in order to throttle the promise executions)
 */

'use strict';

const
    fs = require('fs'),
    {log, warn, assign} = require('fjl'),
    {promisify} = require('util'),
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

    // Options
    _subPortfolioSuffix = '', // sub folder where actual images are kept (default blank)
    _allowedImagesRegex = /\.(jpg|jpeg|png)$/i,
    _targetImageWidths = rpiUtils.fib(89, 1000),

    _defaultOptions = {
      inputPathPrefix: '',
      outputPathPrefix: '',
      subPortfolioSuffix: _subPortfolioSuffix,
      allowedImagesRegex: _allowedImagesRegex,
      targetImageWidths: _targetImageWidths
    },

    // External options
    {refreshPortfolioImagesConfig} = require('../../package'),

    // Overall options to use
    incomingOptions = assign(_defaultOptions, refreshPortfolioImagesConfig),

    handleError = err => {
        if (err) {
            throw new Error(err)
        }
    },

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
                        warn(`Skipping ${filePath}.  Only directories allowed directly in 'portfolios' folder`)
                        return [filePath, fileOutputPath, []];
                    }
                    return [
                        filePath,
                        fileOutputPath,
                        toImagesAssocList(filePath, fileOutputPath, allowedImagesRegex, targetImageWidths)
                    ];
                });
            })))
            .then(dirTuplesList => {
                dirTuplesList.map()
            })
            .catch(handleError);
    },

    toImagesAssocList = (fileInputPathPrefix, fileOutputPathPrefix, allowedImagesRegex, targetImageWidths) => {
        log(`\nGenerating images associated list for ${fileInputPathPrefix}...\n`);
        return ioReadDirectory(fileInputPathPrefix).then(files => Promise.all(
            files.map(file => {
                const fileInputPath = path.join(fileInputPathPrefix, file);
                return ioStat(fileInputPath).then(fileStats => {
                    if (!fileStats.isFile() || !allowedImagesRegex.test(fileInputPath)) {
                        log(`Skipping: ${fileInputPath}`);
                        return [fileInputPath, []];
                    }
                    return ioImageSize(fileInputPath)
                      .then(({type, width, height}) => [
                        fileInputPath,
                        targetImageWidths.map(targetWidth => ({
                                parentDirectory: fileInputPathPrefix,
                                originalFilePath: fileInputPath,
                                newWidth: targetWidth,
                                newHeight: rpiUtils.ratio(width, height, targetWidth),
                                newFilePath: fileOutputPathPrefix + '/' +
                                    path.basename(file, '.' + type) + '-' + targetWidth + '.' + type
                            }))
                      ])
                });
            })))
            .catch(handleError)
    },

    processPortfoliosDir = (inputPath, outputPath, subPortfolioSuffix, allowedImagesRegex, targetImageWidths) => {
        ioReadDirectory(inputPath).then(files => Promise.all(
            files.map(file => {
                let filePath = path.join(inputPath, file, subPortfolioSuffix),
                    fileOutputPath = path.join(outputPath, file, subPortfolioSuffix);
                return ioStat(filePath).then(fileStats => {
                    if (!fileStats.isDirectory()) {
                        return;
                    }
                    return ensureOutputPath(fileOutputPath)
                        .then(message => {
                            log(message);
                            return processPortfolioDir(filePath, fileOutputPath, allowedImagesRegex, targetImageWidths);
                        });
                });
            })))
            .catch(handleError);
    },

    ensureOutputPath = outputPath =>
        ioDoesFilePathExists(outputPath)
            .then(() => outputPath + ' already exists not creating the path.')
            .catch(() =>
                mkdirp(outputPath)
                    .then(() => 'Directory chain created for path: ' + outputPath)
                    .catch(err => 'Error creating `outputPath`;  Error: ' + err)
            )

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
