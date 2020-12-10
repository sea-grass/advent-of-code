const { argv } = require('process');
const path = require('path');
const PartOne = require('./part-one');
const PartTwo = require('./part-two');
const { debug } = require('./debug');

if (argv.length !== 3) {
    usage(argv);
    process.exit(1);
} else {
    run(argv);
}

function usage() {
    const filePath = path.resolve(__dirname, argv[1]);
    console.log(`node ${filePath} <input file>`);
}

async function run(args) {
    const filePath = path.resolve('.', args[2]);

    try {
        print('Solving for Part One');
        const result = await solve(filePath, PartOne);
    } catch(e) {
        debug(e);
    }

    try {
        print('Solving for Part Two');
        const result = await solve(filePath, PartTwo);
    } catch(e) {
        debug(e);
    }
}

async function solve(filePath, module) {
    const input = await module.readFile(filePath);
    debug(input);
    const result = module.solve(input);
    print(result);
}

function print(result) {
    console.log(result);
}