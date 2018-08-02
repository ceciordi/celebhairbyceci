/**
 * Created by elydelacruz on 7/19/16.
 * @description Generate a JSON file which resembles all 'portfolio' directories and their files.
 * @todo Make script reference asset paths relatively.
 */

const
    path = require('path'),
    mime = require('mime'),
    markdown = require('markdown-it')(),
    {assign, peek, error, log} = require('fjl'),
    {ensureOutputPath, ioReadDirectory, ioStat, ioReadFile, ioWriteFile, ioDoesFilePathExists} = require('../utils/utils'),
    {refreshPortfolioImagesConfig, refreshPortfolioJsonC} = require('../../package'),
    entryDefaults = require('./entry-defaults'),
    defaultOptions = {
        markdownInputPath:  'src/assets/portfolio-descriptions-markdown',
        inputPath:          refreshPortfolioImagesConfig.outputPathPrefix,
        outputPath:         'src/assets/json',
        outputFileName:     'portfolios-data.json'
    },

    incomingOptions = {...defaultOptions, ...refreshPortfolioJsonC},

    refreshPortfoliosJson = options => {
        const {outputPath, outputFileName} = options;
        return ensureOutputPath(outputPath)
            .then(() => parseDir(options))
            .then(parsed => peek('\npeek at parsed:', parsed))
            .then(JSON.stringify.bind(JSON))
            .then(json => ioWriteFile(path.join(outputPath, outputFileName), json))
            .catch(error);
    },

    parseDir = options => {
        const {inputPath, outputPath, outputFileName, markdownInputPath} = options;
        log(`\nParsing file path: ${inputPath} ...`);
        return ioReadDirectory(inputPath).then(files =>
            Promise.all(files.map(file => {
                    const filePath = path.join(inputPath, file),
                        httpPathName = filePath.replace(/\\+/, '/').split('/src/').pop(),
                        entry = {
                            fileName: file,
                            filePath: httpPathName,
                            fileType: ''
                        };
                    return ioStat(filePath).then(stat => {
                        if (stat.isDirectory()) {
                            entry.fileType = 'dir';
                            entry.description = getDirDescr(file, markdownInputPath);
                            log (`\nFound nested directory, parsing it ...`);
                            return parseDir({inputPath: filePath, outputPath, outputFileName, markdownInputPath})
                                .then(f => { entry.files = f; return entry; });
                        }
                        parseFile({inputPath: filePath, outputPath, outputFileName, markdownInputPath}, entry);

                    });
                })
            ));
    },

    parseFile = (options, entry) =>
        Promise.resolve(
            /\d+\.(jpg|png|jpeg)/.test(file) ? // Make this regex and option of `incomingConfig`
                assign(entry, {
                    fileType: 'file',
                    ext: path.extname(file),
                    mimeType: mime.getType(file)
                }) : entry
        ),

    getDirDescr = (folderName, markdownInputPath) => {
        const mdLocation = path.join(markdownInputPath, folderName + '.md');
        return ioDoesFilePathExists(mdLocation)
            .then(() => ioReadFile(mdLocation))
            .then(md => markdown.render(md.toString('utf8')))
            .catch(() => entryDefaults.description);
    }
;

refreshPortfoliosJson(incomingOptions);

/* SUDO CODE
    For each in 'portfolios' directory


 */
