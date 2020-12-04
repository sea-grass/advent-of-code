const { wrap } = require('./debug');

const requiredFields = [
    "byr",
    "iyr",
    "eyr",
    "hgt",
    "hcl",
    "ecl",
    "pid",
    // "cid"
];
const hasRequiredFields = passport => {
    const keys = Object.keys(passport);

    let isValid = true;
    for (let i = 0; i < requiredFields.length; i++) {
        if (keys.indexOf(requiredFields[i]) < 0) {
            isValid = false;
            break;
        }
    }

    return isValid;
};

const hasValidBirthYear = passport => numberIsBetween(passport.byr, 1920, 2002);

const hasValidIssueYear = passport => numberIsBetween(passport.iyr, 2010, 2020);

const hasValidExpirationYear = passport => numberIsBetween(passport.eyr, 2020, 2030);

const hasValidHeight = passport => {
    const height = passport.hgt;

    if (height.endsWith('cm')) return numberIsBetween(height.substr(0, height.length - 2), 150, 193);
    else if (height.endsWith('in')) return numberIsBetween(height.substr(0, height.length - 2), 59, 76);
    else return false;
};

const validHairColourPattern = /^#[0-9a-fA-F]{6}$/;
const hasValidHairColour = passport => validHairColourPattern.test(passport.hcl);

const validEyeColours = [
    "amb",
    "blu",
    "brn",
    "gry",
    "grn",
    "hzl",
    "oth"
];
const hasValidEyeColour = passport => validEyeColours.indexOf(passport.ecl) >= 0;

const validPassportIdPattern = /^[0-9]{9}$/;
const hasValidPassportId = passport => validPassportIdPattern.test(passport.pid);

module.exports = {
    hasRequiredFields: wrap(hasRequiredFields),
    hasValidBirthYear: wrap(hasValidBirthYear),
    hasValidIssueYear: wrap(hasValidIssueYear),
    hasValidExpirationYear: wrap(hasValidExpirationYear),
    hasValidHeight: wrap(hasValidHeight),
    hasValidHairColour: wrap(hasValidHairColour),
    hasValidEyeColour: wrap(hasValidEyeColour),
    hasValidPassportId: wrap(hasValidPassportId)
};

function numberIsBetween(number, min, max) {
    const x = Number.parseInt(number);

    return number >= min && number <= max;
}