/**
 * Created by elydelacruz on 7/19/16.
 */

const
    fs = require('fs'),
    path = require('path'),
    mime = require('mime'),
    markdown = require('markdown-it')(),
    {promisify} = require('util'),
    {ensureOutputPath, ioReadDirectory, ioStat, ioReadFile, ioWriteFile, ioDoesFilePathExists} = require('../utils/utils'),
    ioMimeType = promisify(mime.getType.bind(mime)),
    {refreshPortfolioImagesConfig, refreshPortfolioJsonC} = require('../../package'),
    entryDefaults = require('./entry-defaults'),
    defaultOptions = {
        markdownInputPath:  './src/assets/portfolio-descriptions-markdown',
        inputPath:          './src/assets/portfolios-processed',
        outputPath:         './src/assets/json',
        outputFileName:     'portfolios-data.json'
    },

    incomingOptions = assign({}, defaultOptions, refreshPortfolioJsonC),

    refreshPortfoliosJson = ({inputPath, outputPath, outputFileName, markdownInputPath}) =>
        ensureOutputPath(outputPath)
            .then(() => parseDir({inputPath, outputPath, outputFileName, markdownInputPath}))
            .then(JSON.stringify.bind(JSON))
            .then(json => ioWriteFile(path.join(outputPath, outputFileName), json)),

    parseDir = ({inputPath, outputPath, outputFileName, markdownInputPath}) =>
        ioReadDirectory(inputPath).then(files =>
            Promise.all(files.map(file => {
                    const filePath = path.join(inputPath, file),
                        httpPathName = filePath.replace(/\\+/, '/').split('/src/').pop(),
                        entry = {
                            fileName: file,
                            filePath: httpPathName,
                            fileType: ''
                        };
                    ioStat(filePath).then(stat => {
                        if (stat.isDirectory()) {
                            entry.fileType = 'dir';
                            entry.description = getDirDescr(file, markdownInputPath);
                            return parseDir({filePath, outputPath, outputFileName, markdownInputPath})
                                .then(f => { entry.files = f; return entry; });
                        }
                        else if (/\d+\.(jpg|png|jpeg)/.test(file)) {
                            return ioMimeType(filePath)
                                .then(mimeType => (assign(entry, {
                                    fileType: 'file',
                                    ext: path.extname(file),
                                    mimeType: mimeType
                                })));
                        }
                        return Promise.resolve(entry);
                    });
                })
            )),

    getDirDescr = (folderName, markdownInputPath) => {
        const mdLocation = path.join(markdownInputPath, folderName + '.md');
        return ioDoesFilePathExists(mdLocation)
            .then(() => ioReadFile(mdLocation))
            .then(md => markdown.render(md.toString('utf8')))
            .catch(() => entryDefaults.description);
    }
;

refreshPortfoliosJson(incomingOptions);
