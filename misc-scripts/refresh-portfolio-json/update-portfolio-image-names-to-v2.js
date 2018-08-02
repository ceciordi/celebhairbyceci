/**
 * Created by Ely on 7/18/2016.
 */
var fs = require('fs'),
    path = require('path'),
    sjl = require('sjljs'),
    mkdirp = require('mkdirp'),
    inputPathPrefix = './public',
    outputPathPrefix = './public/generated',
    imgsPathSuffix = 'media/images/portfolio',
    inputImgsPath = path.join(inputPathPrefix, imgsPathSuffix),
    outputImgsPath = path.join(outputPathPrefix, imgsPathSuffix),
    imgSuffixMap = {
        '1': '89',
        '2': '144',
        '3': '233',
        '4': '377',
        '5': '610',
        '6': '987',
        '7': '1597',
        '8': '2548',
        '9': '2548',
        '10': '2548',
        '11': '2548',
        '12': '4181'
    },
    suffixRegexToReplace = /_(\d+)\-(\d+)\.(jpg|png|jpeg)$/i;

function handleError(err) {
    if (err) {
        throw new Error(err);
    }
}

function startProcess (inputPath, outputPath, fileSuffixMap) {
    fs.readdir(inputPath, function (err, files) {
        handleError(err);
        files.forEach(function (file) {
            var filePath = path.join(inputPath, file, 'images'),
                fileOutputPath = path.join(outputPath, file, 'images');
            fs.stat(filePath, function (err, fileStats) {
                handleError(err);
                if (fileStats.isDirectory()) {
                    ensureOutputPath(fileOutputPath)
                        .then(function (message) {
                            console.log(message);
                            renameAndCopyFiles(filePath, fileOutputPath, fileSuffixMap);
                        });
                }
            });
        });
    });
}

function ensureOutputPath (outputPath) {
    return new Promise(function (resolve, reject) {
        fs.access(outputPath, function (err) {
            if (!sjl.empty(err)) {
                resolve(outputPath + ' already exists not creating the path.');
            }
            mkdirp(outputPath, function (err) {
                !sjl.empty(err) ? reject(err) : resolve('Directory chain created for path: ' + outputPath);
            });
        });
    });
}

function renameAndCopyFiles (fileInputPathPrefix, fileOutputPathPrefix, fileSuffixMap) {
    fs.readdir(fileInputPathPrefix, function (err, files) {
        handleError(err);
        files.forEach(function (file) {
            var fileInputPath = path.join(fileInputPathPrefix, file),
                fileOutputPath = path.join(fileOutputPathPrefix, file);
            fs.stat(fileInputPath, function (err1, fileStats) {
                handleError(err1);

                if (fileStats.isFile() && suffixRegexToReplace.test(fileInputPath)) {
                    var filePathParts = fileInputPath.match(suffixRegexToReplace),
                        newSuffixNum,
                        newFileOutputPath;

                    // If file doesn't match our pattern
                    if (filePathParts.length < 4 || !fileSuffixMap.hasOwnProperty(filePathParts[2])) {
                        console.log('Skipping file: ', fileInputPath, 'File doesn\'t match the required format.');
                        return;
                    }

                    // Get new parts
                    newSuffixNum = fileSuffixMap[filePathParts[2]];
                    newFileOutputPath = fileOutputPath.replace(/(\d+)\.(?:jpg|jpeg|tiff|bmp)$/i,
                        newSuffixNum + '.' + filePathParts[3]);

                    // console.log(newFileOutputPath);

                    fs.readFile(fileInputPath, function (err2, data) {
                        handleError(err2);
                        fs.writeFile(newFileOutputPath, data, function (err3) {
                            err3 ? console.log(err3) : console.log(newFileOutputPath + ' written successfully.');
                        });
                    });
                }
            });
        });
    });
}

startProcess(inputImgsPath, outputImgsPath, imgSuffixMap);
