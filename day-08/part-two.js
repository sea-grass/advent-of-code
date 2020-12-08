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
    let result;

    const swappables = instructions
        .map(({ op }, index) => ({
            op, index
        }))
        .filter(({ op }) => op === 'nop' || op === 'jmp')
        .map(({ index }) => index);

    for (let i = 0; i < swappables.length; i++) {
        const indexToSwap = swappables[i];

        const swappedInstructions = instructions.map((instruction, index) => {
            if (index === indexToSwap) {
                const newOp = instruction.op === 'nop' ? 'jmp' : 'nop';
                return {
                    op: newOp,
                    args: instruction.args
                };
            } else {
                return instruction;
            }
        });

        if (!Program.loops(swappedInstructions)) {
            const program = new Program(swappedInstructions);
            program.run();
            result = program.state.reg0;
            break;
        }
    }

    return result;
}

module.exports = {
    readFile,
    solve
}