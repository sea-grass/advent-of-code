const nop = ({ next_instruction, ...rest }) => ({
    ...rest,
    next_instruction: next_instruction + 1
});

const acc = ({ reg0, next_instruction, ...rest }, args) => ({
    ...rest,
    reg0: reg0 + args[0],
    next_instruction: next_instruction + 1
});

const jmp = ({ next_instruction, ...rest }, args) => ({
    ...rest,
    next_instruction: next_instruction + args[0]
});

module.exports = {
    nop,
    acc,
    jmp
}