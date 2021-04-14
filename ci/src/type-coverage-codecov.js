const path = require('path');
const fs = require('fs');
const { lint } = require('type-coverage-core');

const coverageModule = process.argv[2];

if (!coverageModule) {
    console.error('Module path to generate type coverage report was not specified.');
    process.exit(1);
}

const coverageModuleSrcPath = path.join('..', coverageModule, 'src');
const outputFileDir = path.join(process.cwd(), 'coverage');
const outputFilePath = path.join(outputFileDir, `${coverageModule.replace('/', '_')}.json`);

console.log('Generating type coverage report at', coverageModuleSrcPath);

lint(coverageModuleSrcPath, { strict: true, fileCounts: true, absolutePath: true })
    .then((result) => {
        const percentage = result.correctCount / result.totalCount;
        console.log('Overall coverage is:', `${Math.floor(percentage * 100)}.${Math.floor(percentage * 100 * 100) % 100}`, '%');
        const coverage = {};

        result.fileCounts.forEach((value, key) => {
            const { correctCount, totalCount } = value;
            const fileName = key;

            const fileCoverage = {};
            [...Array(totalCount).keys()]
                .forEach((index) => {
                    fileCoverage[`${index}`] = index < correctCount ? 1 : 0;
                })
            coverage[fileName] = fileCoverage;
        });

        if (!fs.existsSync(outputFileDir)) {
            fs.mkdirSync(outputFileDir)
        }

        fs.writeFile(outputFilePath, JSON.stringify({ coverage }), (err) => {
            if (err) {
                console.error('Error while writing to file', err);
                process.exit(1);
            } else {
                console.log('Generated codecov type coverage report at', outputFilePath);
            }
        })
    });