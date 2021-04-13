const path = require('path');
const fs = require('fs');
const { lint } = require('type-coverage-core');

const outputFilePath = path.join(process.cwd(), 'coverage', 'type-coverage.json');

lint('./src', { strict: true, fileCounts: true })
    .then((result) => {
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

        fs.writeFile(outputFilePath, JSON.stringify(coverage), (err) => {
            if (err) {
                console.error('Error while writing to file', err);
            } else {
                console.log('Generated codecov type coverage report at', outputFilePath);
            }
        })
    });