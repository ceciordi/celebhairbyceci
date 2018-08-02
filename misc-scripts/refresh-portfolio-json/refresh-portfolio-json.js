/**
 * Created by elydelacruz on 7/19/16.
 * Refactored: 08/02/2018
 * @description Generates a JSON file which resembles all 'portfolio' directories and their files as JSON.
 * @todo Make script reference asset paths relatively.
 */

const
    path = require('path'),
    mime = require('mime'),
    markdown = require('markdown-it')(),
    {assign, error, log, compose, head, tail, split} = require('fjl'),
    {ensureOutputPath, ioReadDirectory, ioStat, ioReadFile, ioWriteFile, ioDoesFilePathExists, ioImageSize} = require('../utils/utils'),
    {refreshPortfolioImagesConfig, refreshPortfolioJsonC} = require('../../package'),
    // entryDefaults = require('./entry-defaults'),
    defaultOptions = {
        markdownInputPath:  'src/assets/portfolio-descriptions-markdown',
        inputPath:          refreshPortfolioImagesConfig.outputPathPrefix,
        outputPath:         'src/assets/json',
        outputFileName:     'portfolios-data.json',
        forHttpSplitFilePathAt: 'src/'
    },

    incomingOptions = {...defaultOptions, ...refreshPortfolioJsonC},

    refreshPortfoliosJson = options => {
        const {outputPath, outputFileName} = options;
        return ensureOutputPath(outputPath)

            // Parse 'portfolios' directory
            .then(() => parseDir(options))

            // Only allow directories at top level of portfolios directory
            .then(parsed => parsed.filter(entry => entry.fileType === 'dir'))

            // Parse `parsed` directories structure to JSON string
            .then(parsed => JSON.stringify(parsed, null, 5))

            // .then(parsed => peek('\npeek at parsed:', parsed))

            // Write json to file
            .then(json => {
                const outputFilePath = path.join(outputPath, outputFileName);
                return ioWriteFile(outputFilePath, json).then(() => outputFilePath);
            })

            // Notify user of success
            .then(outputFilePath => log(`\nJson file written successfully to: ${outputFilePath}`))

            // Fail if failure
            .catch(error);
    },

    parseDir = options => {
        const {inputPath, markdownInputPath, forHttpSplitFilePathAt} = options;
        log(`\nParsing file path: ${inputPath} ...`);

        // Get files list for directory at `inputPath`
        return ioReadDirectory(inputPath).then(files =>

            // Parse files in directory at `inputPath`
            Promise.all(files.map(file => {

                    // Join path for file `file`
                    const filePath = path.join(inputPath, file),

                        // Get file path for http friendly use
                        httpPathName = compose(head, tail, split(forHttpSplitFilePathAt))(filePath.replace(/\\+/, '/')),

                        // Get file entry to output in our JSON
                        entry = {
                            fileName: file,
                            filePath: httpPathName
                        };

                    // Parse the file at `filePath`
                    return ioStat(filePath).then(stat => {

                        // If is directory get update `entry` and get it's subsequent files list
                        if (stat.isDirectory()) {
                            entry.fileType = 'dir';
                            entry.description = getDirDescr(file, markdownInputPath);
                            log (`\nFound nested directory, parsing it ...`);
                            return parseDir({...options, inputPath: filePath})
                                .then(f => { entry.files = f; return entry; });
                        }

                        // Else parse incoming file
                        return parseFile({...options, file, filePath}, entry);
                    });
                })
            ));
    },

    parseFile = ({file, filePath}, entry) =>
        Promise.resolve(
            /\d+\.(jpg|png|jpeg)/.test(file) ? // Make this regex and option of `incomingConfig`
                ioImageSize(filePath).then(({width, height}) => assign({
                    fileType: 'file',
                    ext: path.extname(file),
                    mimeType: mime.getType(file),
                    height,
                    width
                }, entry)) : entry
        ),

    getDirDescr = (folderName, markdownInputPath) => {
        const mdLocation = path.join(markdownInputPath, folderName + '.md');
        log (`\nChecking for markdown description file at path: ${mdLocation}`);
        return ioDoesFilePathExists(path.join(__dirname, '../../', mdLocation))
            .then(() => ioReadFile(mdLocation))
            .then(md => markdown.render(md.toString('utf8')))
            .catch(() => undefined);
    }
;

refreshPortfoliosJson(incomingOptions);
