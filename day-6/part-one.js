const fs = require('fs');
const readline = require('readline');
const { debug } = require('./debug');

function readFile(filePath) {
    return new Promise((resolve, reject) => {
        const readInterface = readline.createInterface({
            input: fs.createReadStream(filePath)
        });

        const input = [];

        let group = new Set();
        readInterface.on('line', line => {
            if (line.length > 0) {
                Array.from(line).forEach(item => group.add(item));
            } else {
                input.push(group);
                group = new Set();
            }
        });
        readInterface.on('close', () => {
            input.push(group);
            debug('done reading lines', input);
            resolve(input);
        })
    })
}

function solve(input) {
    let sum = 0;
    for (const group of input) {
        sum += group.size;
    }

    const result = sum;

    return result;
}

module.exports = {
    readFile,
    solve
}