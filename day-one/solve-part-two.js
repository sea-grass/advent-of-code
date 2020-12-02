const fs = require('fs');
const { argv } = require('process');
const path = require('path');
const readline = require('readline');
const DEBUG = false;

if (argv.length !== 3) {
    usage();
    process.exit(1);
} else {
    run(argv);
}

function usage() {
    return 'node solve.js <input file>';
}

async function run(args) {
    const filePath = path.resolve(__dirname, args[2]);
    const input = await readFile(filePath);
    const goal = 2020;
    const result = solve(goal, input);
    print(result);
}

function readFile(filePath) {
    return new Promise((resolve, reject) => {
        const readInterface = readline.createInterface({
            input: fs.createReadStream(filePath)
        });
        const input = [];
        readInterface.on('line', line => {
            debug(line);
            input.push(Number.parseInt(line));
        });
        readInterface.on('close', () => {
            debug('done reading lines', input);
            resolve(input);
        })
    })
}

function solve(goal, input) {
    for (let i = 0; i < input.length; i++) {
        for (let j = i + 1; j < input.length; j++) {
            let first = input[i], second = input[j];

            if (first + second >= goal) continue;
            
            for (let k = j + 1; k < input.length; k++) {
                let third = input[k];
                if (first + second + third === goal) {
                    return first * second * third;
                }
            }
        }
    }

    return -1;
}

function print(result) {
    console.log(result);
}

function debug() {
    if (DEBUG) console.log.apply(console, arguments);
}