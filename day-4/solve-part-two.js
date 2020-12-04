const fs = require('fs');
const { argv } = require('process');
const path = require('path');
const readline = require('readline');
const Passport = require('./passport');
const { debug } = require('./debug');

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
        let curr = {};

        readInterface.on('line', line => {
            if (line.length === 0) {
                input.push(curr);
                curr = {};
            } else {
                const parts = line.split(' ');
                parts
                    .map(part => part.split(':'))
                    .forEach(([key, value]) => {
                        curr[key] = value;
                    })
            }
        });
        readInterface.on('close', () => {
            input.push(curr);
            debug('done reading lines', input);
            resolve(input);
        })
    })
}

function solve(input) {
    const result = input.reduce((numValid, passport) => {
        if (isPassportValid(passport)) return numValid + 1;
        else {
            debug('passport is invalid', passport);
            return numValid;
        }
    }, 0)

    return result;
}

function isPassportValid(passport) {
    return Passport.hasRequiredFields(passport) &&
        Passport.hasValidBirthYear(passport) &&
        Passport.hasValidIssueYear(passport) &&
        Passport.hasValidExpirationYear(passport) &&
        Passport.hasValidHeight(passport) &&
        Passport.hasValidHairColour(passport) &&
        Passport.hasValidEyeColour(passport) &&
        Passport.hasValidPassportId(passport);
}

function print(result) {
    console.log(result);
}