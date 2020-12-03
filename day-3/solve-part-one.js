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
    debug(input);
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
        let scanIndex = 3;
        readInterface.on('line', line => {
            // skip the first line
            if (numLinesRead === 0) {
                numLinesRead++;
                return;
            }

            const item = line[scanIndex % line.length];
            input.push(item);

            scanIndex += 3;
            numLinesRead++;
        });
        readInterface.on('close', () => {
            debug('done reading lines', input);
            resolve(input);
        })
    })
}

function solve(input) {
    const result = input.reduce((numTrees, curr) => {
        if (curr === '#') return numTrees + 1;
        else return numTrees;
    }, 0);

    return result;
}

function print(result) {
    console.log(result);
}

function debug() {
    if (DEBUG) console.log.apply(console, arguments);
}