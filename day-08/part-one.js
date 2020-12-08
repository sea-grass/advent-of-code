const fs = require('fs');
const readline = require('readline');
const { debug } = require('./debug');
const { Program } = require('./program');

function readFile(filePath) {
    return new Promise((resolve, reject) => {
        const readInterface = readline.createInterface({
            input: fs.createReadStream(filePath)
        });

        let instructions = [];

        readInterface.on('line', line => {
            const instruction = parseInstruction(line);
            instructions.push(instruction);
        });
        
        readInterface.on('close', () => {
            debug('done reading lines', instructions);
            resolve(instructions);
        })
    })
}

function parseInstruction(str) {
    const [op, ...args] = str.split(' ');

    return {
        op,
        args: args.map(Number.parseInt)
    };
}

function solve(instructions) {
    const program = new Program(instructions);

    let result;

    let instruction;
    while (instruction = program.peek()) {
        if (instruction.hasRun) {
            result = program.state.reg0;
            break;
        } else {
            program.step();
        }
    }

    return result;
}

module.exports = {
    readFile,
    solve
}