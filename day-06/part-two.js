const fs = require('fs');
const readline = require('readline');
const { debug } = require('./debug');

function readFile(filePath) {
    return new Promise((resolve, reject) => {
        const readInterface = readline.createInterface({
            input: fs.createReadStream(filePath)
        });

        const input = [];

        let group = new Map();
        let numMembers = 0;

        readInterface.on('line', line => {
            if (line.length > 0) {
                numMembers++;

                Array.from(line).forEach(key => {
                    if (group.has(key)) {
                        group.set(key, group.get(key) + 1);
                    } else {
                        group.set(key, 1);
                    }
                });
            } else {
                input.push({
                    group,
                    numMembers
                });

                group = new Map();
                numMembers = 0;
            }
        });
        readInterface.on('close', () => {
            input.push({
                group,
                numMembers
            });

            debug('done reading lines', input);
            resolve(input);
        })
    })
}

function solve(input) {
    let sum = 0;
    for (const { group, numMembers } of input) {
        for (const [, count] of group) {
            if (count === numMembers) {
                sum++;
            }
        }
    }

    const result = sum;

    return result;
}

module.exports = {
    readFile,
    solve
}