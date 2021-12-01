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
        readInterface.on('line', line => {
            const item = parseLine(line);
            input.push(item);
        });
        readInterface.on('close', () => {
            debug('done reading lines', input);
            resolve(input);
        })
    })
}

function parseLine(line) {
    const parts = line.split(' ');
    const range = parts[0].split('-').map(n => Number.parseInt(n));
    debug(range, parts[0].split('-'))
    const char = parts[1][0];
    const value = parts[2];

    return { range, char, value };
}

function solve(input) {
    const result = input.reduce((numValid, { range, char, value }) => {
        const min = range[0], max = range[1];
        let numOccurences = 0;
        for (let i = 0; i < value.length; i++) {
            if (value[i] === char) {
                numOccurences++;
            }

            if (numOccurences > max) {
                break;
            }
        }

        if (min <= numOccurences && numOccurences <= max) {
            return numValid + 1;
        } else {
            return numValid;
        }
    }, 0);

    return result;
}

function print(result) {
    console.log(result);
}

function debug() {
    if (DEBUG) console.log.apply(console, arguments);
}