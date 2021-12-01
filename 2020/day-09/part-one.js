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

    let mem = nums.slice(0, preamble);
    let currMem = 0;

    let result;
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
            mem[currMem] = targetSum;
            currMem = (currMem + 1) % mem.length;
        } else {
            result = targetSum;
            break;
        }
    }

    debug(result);

    return result;
}

module.exports = {
    readFile,
    solve
}