/**
 * Created by elydelacruz on 7/19/16.
 */

'use strict';

let fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    sjl = require('sjljs'),
    stream = require('stream'),
    Readable = stream.Readable,
    mime = require('mime'),
    util = require('util'),
    markdown = require('markdown-it')(),
    entryDefaults = require('./entry-defaults'),
    defaultOptions = {
        markdownInputPath:  './public-dev/data/portfolio-descriptions-md',
        inputPath:          './public/media/images/portfolio',
        outputPath:         './public/data',
        outputFileName:     'portfolio-data.json'
    };

function PortfoliosReadStream (inputPath, markdownInputPath) {
    Readable.call(this, {
        highWatermark: 100000
    });
    this._inputPath = inputPath;
    this._markdownInputPath = markdownInputPath;
}

util.inherits(PortfoliosReadStream, Readable);

PortfoliosReadStream.prototype._read = function (chunk) {
    var self = this;
    self.push(JSON.stringify(main(self._inputPath, self._markdownInputPath))); //, null, '    '));
    self.push(null);
};

function getFolderDescr (folderName, markdownInputPath) {
    var mdLocation = path.join(markdownInputPath, folderName + '.md'),
        description;
    if (fs.existsSync(mdLocation)) {
        description = markdown.render(fs.readFileSync(mdLocation).toString('utf8'));
    }
    else {
        description = entryDefaults.description;
    }
    return description;
}

function main (dir, markdownInputPath) {
    var out = [];
    fs.readdirSync(dir).forEach(function (file) {
        var filePath = path.join(dir, file),
            httpPathName = filePath.replace(/\\+/, '/').replace(/^public/, ''),
            stat = fs.statSync(filePath),
            entry = {
                fileName: file,
                filePath: httpPathName
            };

        if (stat.isDirectory()) {
            entry.files = main(filePath, markdownInputPath);
            entry.fileType = 'dir';
            entry.description = getFolderDescr(file, markdownInputPath);
            out.push(entry);
        }

        // Only allow images and videos with 960.gs grid sizes 1, 2, 3, 5, 8, 12
        else if (/\d+\.(jpg|png|jpeg)/.test(file)) {
            out.push({
                filePath: httpPathName,
                fileType: 'file',
                ext: path.extname(file),
                mimeType: mime.lookup(file)
            });
        }
    });
    return out;
}

function ensureOutputPath (outputPath) {
    return new Promise(function (resolve, reject) {
        fs.access(outputPath, function (err) {
            if (!sjl.empty(err)) {
                mkdirp(outputPath, function (err2) {
                    !sjl.empty(err2) ? reject(err2) : resolve('Directory chain created for path: ' + outputPath);
                });
            }
            resolve(outputPath + ' already exists not creating the path.');
        });
    });
}

function startProcess (inputPath, markdownInputPath, outputPath, outputFileName) {
    return ensureOutputPath(outputPath)
        .then(function () {
            let writeStream = fs.createWriteStream(path.join(outputPath, outputFileName)),
                readStream = new PortfoliosReadStream(inputPath, markdownInputPath);
            return readStream.pipe(writeStream);
        });
}

module.exports = function (options) {
    let ops = sjl.extend({}, defaultOptions, options);
    return function () {
        return startProcess(
            ops.inputPath,
            ops.markdownInputPath,
            ops.outputPath,
            ops.outputFileName
        );
    };
};
