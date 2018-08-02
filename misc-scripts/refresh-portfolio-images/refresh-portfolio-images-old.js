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
    mime = require('mime'),
    gm = require('gm'),
    imageMagickStream = require('imagemagick-stream'),
    imageSize = require('image-size'),
    rpiUtils = require('./utils'),
    ioReadDirectory = promisify(fs.readdir),
    ioDoesFilePathExists = promisify(fs.access),
    ioStat = promisify(fs.stat),

    _subPortfolioSuffix = 'images',
    _allowedImagesRegex = /\.(jpg|jpeg|png)$/i,
    _targetImageWidths = rpiUtils.fib(89, 1000),

    handleError = err => {
        if (err) {
            throw new Error(err)
        }
    },

    processPortfoliosDirectory = (inputPath, outputPath, subPortfolioSuffix, allowedImagesRegex, targetImageWidths) => {
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
                        return [fileInputPath, []];
                    }
                    const {type, width, height} = imageSize(fileInputPath);
                    return [fileInputPath, targetImageWidths.map(targetWidth => ({
                            parentDirectory: fileInputPathPrefix,
                            originalFilePath: fileInputPath,
                            newWidth: targetWidth,
                            newHeight: rpiUtils.ratio(width, height, targetWidth),
                            newFilePath: fileOutputPathPrefix + '/' +
                                path.basename(file, '.' + type) + '-' + targetWidth + '.' + type
                        }))];
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
            ),

    processPortfolioDir = (fileInputPathPrefix, fileOutputPathPrefix, allowedImagesRegex, targetImageWidths) => {
        log(`\nProcessing files for ${fileInputPathPrefix}.  Please wait...\n`);
        return ioReadDirectory(fileInputPathPrefix).then(files => Promise.all(
            files.map(file => {
                const fileInputPath = path.join(fileInputPathPrefix, file);
                return ioStat(fileInputPath).then(fileStats => {
                    if (!fileStats.isFile() || !allowedImagesRegex.test(fileInputPath)) {
                        return;
                    }

                    let imageDims = imageSize(fileInputPath),
                        readStream = fs.createReadStream(path.resolve(fileInputPath)),
                        completedStreams = 0;

                    targetImageWidths.forEach(targetWidth => {
                        let newWidth = targetWidth,
                            newHeight = rpiUtils.ratio(imageDims.width, imageDims.height, targetWidth),
                            newFileOutputPath = fileOutputPathPrefix + '/' +
                                path.basename(file, '.' + imageDims.type) + '-' + targetWidth + '.' + imageDims.type,
                            resize = imageMagickStream().resize(newWidth + 'x' + newHeight),
                            writeStream = fs.createWriteStream(path.resolve(newFileOutputPath));

                        // console.log(fileInputPath, '\nOld dimensions: ', imageDims,
                        //     '\nNew dimensions: {width: ', newWidth, 'height: ', newHeight, '}\n');

                        // Resize image and save to new location
                        return readStream.pipe(resize).pipe(writeStream).on('finish', err5 => {
                            handleError(err5);
                            ++completedStreams;
                            console.log('completedStreams: ' + completedStreams + '\n');
                        });
                    });
                });
            }))
            .catch(handleError);
    }

;

module.exports = options => {
    const optionsToUse = assign({
        subPortfolioSuffix: _subPortfolioSuffix,
        allowedImagesRegex: _allowedImagesRegex,
        targetImageWidths: _targetImageWidths
    }, options);

    return () => processPortfoliosDir(
        optionsToUse.inputPathPrefix,
        optionsToUse.outputPathPrefix,
        optionsToUse.subPortfolioSuffix,
        optionsToUse.allowedImagesRegex
    );
};

/* SUDO
Read portfolios directory
    Map over portfolio directories
        Read portfolio directory
            Map over images in portfolio directory
                Create thunk for each required image size
*/
