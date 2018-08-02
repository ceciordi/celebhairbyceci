const

    fs = require('fs'),
    {promisify} = require('util'),
    mkdirp = require('mkdirp'),

    ioMkdirp = promisify(mkdirp),
    ioReadDirectory = promisify(fs.readdir),
    ioReadFile = promisify(fs.readFile),
    ioDoesFilePathExists = promisify(fs.access),
    ioStat = promisify(fs.stat),
    ioWriteFile = promisify(fs.writeFile),

    ensureOutputPath = outputPath =>
        ioDoesFilePathExists(outputPath)
            .then(() => `${outputPath} already exists not creating the path.`)
            .catch(() =>
                ioMkdirp(outputPath)
                    .then(() => `Directory file path created for path: ${outputPath}`)
                    .catch(err => `Error creating \`${outputPath}\`;  Error: ${err}`)
            )
;

module.exports = {
    ensureOutputPath,
    ioMkdirp,
    ioReadDirectory,
    ioDoesFilePathExists,
    ioReadFile,
    ioWriteFile,
    ioStat
};
