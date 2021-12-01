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
    let nums = sort(input);

    nums = [0, ...nums, nums[nums.length - 1] + 3];

    const buckets = count(diffs(nums));
    debug(buckets);

    const result = buckets.get(1) * buckets.get(3);

    return result;
}

function sort(numbers) {
    return numbers.slice(0).sort((a, b) => a - b);
}

function diffs(terms) {
    let diffs = [];

    for (let i = 1; i < terms.length; i++) {
        diffs.push(terms[i] - terms[i - 1]);
    }

    debug(terms.length, diffs.length);

    return diffs;
}

function count(nums) {
    debug(nums);

    const buckets = new Map();

    nums.forEach(num => {
        if (buckets.has(num)) {
            buckets.set(num, buckets.get(num) + 1);
        }
        else {
            buckets.set(num, 1);
        }
    });

    return buckets;
}

module.exports = {
    readFile,
    solve
}