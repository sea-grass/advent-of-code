
const Instructions = require('./instructions');

function Instruction(op = null, args = []) {
    if (!op) throw new Error('Instruction.constructor ArgumentError: missing op');

    this.op = op;
    this.args = args;
    this.hasRun = false;
}

Instruction.prototype.run = function (state) {
    const newState = this.op(state, this.args);
    this.hasRun = true;
    return newState;
};

function Program(instructions = []) {
    this.instructions = instructions.map(({ op, args }) => {
        const instructionSet = Program.InstructionSet;
        if (!instructionSet.has(op)) {
            throw new Error('Program.constructor ArgumentError: ' + op + ' is not in the instruction set.');
        }
        return new Instruction(instructionSet.get(op), args);
    });

    this.state = {
        next_instruction: 0,
        reg0: 0
    }
}

Program.InstructionSet = new Map([
    ['nop', Instructions.nop],
    ['acc', Instructions.acc],
    ['jmp', Instructions.jmp]
]);

Program.prototype.getNextInstruction = function () {
    if (this.state.next_instruction >= this.instructions.length) {
        return null;
    } else {
        return this.instructions[this.state.next_instruction];
    }
};

Program.prototype.peek = function () {
    return this.getNextInstruction();
};

Program.prototype.step = function () {
    const instruction = this.getNextInstruction();

    if (instruction === null) {
        throw new Error('Trying to read an instruction, but Program has already completed');
    }

    this.state = instruction.run(this.state);
};

Program.prototype.run = function () {
    let instruction;
    while (instruction = this.getNextInstruction()) {
        this.state = instruction.run(this.state);
    }
};

Program.loops = function (instructions) {
    const program = new Program(instructions);

    let loops = false;

    let instruction;
    while (instruction = program.peek()) {
        if (instruction.hasRun) {
            loops = true;
            break;
        } else {
            program.step();
        }
    }

    return loops;
};

module.exports = {
    Program
};