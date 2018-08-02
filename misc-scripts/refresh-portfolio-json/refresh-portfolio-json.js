/**
 * Created by elydelacruz on 7/19/16.
 */

const
    fs = require('fs'),
    path = require('path'),
    stream = require('stream'),
    Readable = stream.Readable,
    mime = require('mime'),
    util = require('util'),
    {ensureOutputPath} = require('../utils/utils'),
    markdown = require('markdown-it')(),
    entryDefaults = require('./entry-defaults'),
    defaultOptions = {
        markdownInputPath:  './public-dev/data/portfolio-descriptions-md',
        inputPath:          './src/assets/portfolios-processed',
        outputPath:         './src/assets/json',
        outputFileName:     'portfolios-data.json'
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


function startProcess (inputPath, markdownInputPath, outputPath, outputFileName) {
    return ensureOutputPath(outputPath)
        .then(() => {
            let writeStream = fs.createWriteStream(path.join(outputPath, outputFileName)),
                readStream = new PortfoliosReadStream(inputPath, markdownInputPath);
            return readStream.pipe(writeStream);
        });
}

module.exports = function (options) {
    let ops = assign({}, defaultOptions, options);
    return function () {
        return startProcess(
            ops.inputPath,
            ops.markdownInputPath,
            ops.outputPath,
            ops.outputFileName
        );
    };
};
