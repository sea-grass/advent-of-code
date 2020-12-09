const fs = require('fs');
const readline = require('readline');
const { debug } = require('./debug');

function readFile(filePath) {
    return new Promise((resolve, reject) => {
        const readInterface = readline.createInterface({
            input: fs.createReadStream(filePath)
        });

        const input = [];

        readInterface.on('line', line => {
            input.push(Number.parseInt(line));
        });

        readInterface.on('close', () => {
            debug('done reading lines', input);
            resolve(input);
        })
    })
}

function solve(input) {
    const [preamble, ...nums] = input;

    let skip = 0;
    let mem = nums.slice(skip, preamble + skip);

    let target;
    for (let currIndex = preamble; currIndex < nums.length; currIndex++) {
        const targetSum = nums[currIndex];

        let foundSum = false;
        for (let i = 0; i < mem.length; i++) {
            for (let j = i + 1; j < mem.length; j++) {
                if (mem[i] + mem[j] === targetSum) {
                    foundSum = true;
                    break;
                }
            }
            if (foundSum) {
                break;
            }
        }

        if (foundSum) {
            skip++;
            mem = nums.slice(skip, preamble + skip);
        } else {
            target = targetSum;
            break;
        }
    }

    debug('target', target);

    let lowest = 0, highest = 0;
    for (let i = 0; i < nums.length; i++) {
        for (let numTerms = 2; numTerms < (nums.length - i); numTerms++) {
            const terms = nums.slice(i, i + numTerms);
            const sum = terms.reduce((acc, curr) => acc + curr, 0);

            if (sum > target) {
                break;
            } else if (sum === target) {
                lowest = terms[0];
                highest = terms[0];

                for (let j = 0; j < terms.length; j++) {
                    if (terms[j] < lowest) {
                        lowest = terms[j];
                    } else if (terms[j] > highest) {
                        highest = terms[j];
                    }
                }
                break;
            }
        }
    }

    let result = lowest + highest;

    return result;
}

module.exports = {
    readFile,
    solve
}