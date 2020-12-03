const fs = require('fs');
const { argv } = require('process');
const path = require('path');
const readline = require('readline');
const DEBUG = false;

if (argv.length !== 3) {
    usage(argv);
    process.exit(1);
} else {
    run(argv);
}

function usage() {
    const filePath = path.relative(__dirname, argv[1]);
    console.log(`node ${filePath} <input file>`);
}

async function run(args) {
    const filePath = path.resolve(__dirname, args[2]);
    const input = await readFile(filePath);
    const result = solve(input);
    print(result);
}

function readFile(filePath) {
    return new Promise((resolve, reject) => {
        const readInterface = readline.createInterface({
            input: fs.createReadStream(filePath)
        });
        const input = [];
        let numLinesRead = 0;
        
        let indices = [1, 3, 5, 7, 1];
        let skips = [0, 0, 0, 0, 2];
        readInterface.on('line', line => {
            // skip the first line
            if (numLinesRead === 0) {
                numLinesRead++;
                return;
            }

            const item = indices.map((index, i) => {
                if (skips[i] > 0 && numLinesRead % skips[i] !== 0) return '-';

                let skipOffset = skips[i] < 1 ? 0 : Math.floor(numLinesRead / (skips[i]));
                let targetIndex = (index * numLinesRead - skipOffset) % line.length;
                
                debug(i, targetIndex);
                
                return line[targetIndex]
            });
            input.push(item);

            debug(numLinesRead, item);

            numLinesRead++;
        });
        readInterface.on('close', () => {
            resolve(input);
        })
    })
}

function solve(input) {
    const numTreesPerSlope = input.reduce((countMap, line) => {
        for (let i = 0; i < line.length; i++) {
            if (!Number.isInteger(countMap[i])) countMap[i] = 0;
            if (line[i] === '#') countMap[i]++;
        }
        return countMap;
    }, []);

    debug(numTreesPerSlope);

    const result = numTreesPerSlope.reduce((product, curr) => product * curr, 1);

    return result;
}

function print(result) {
    console.log(result);
}

function debug() {
    if (DEBUG) console.log.apply(console, arguments);
}