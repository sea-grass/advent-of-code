const fs = require('fs');
const readline = require('readline');
const { debug } = require('./debug');

function readFile(filePath) {
    return new Promise((resolve, reject) => {
        const readInterface = readline.createInterface({
            input: fs.createReadStream(filePath)
        });

        const input = [];

        readInterface.on('line', line => {
            let numRows = 128;
            let startRow = 0;
            const rowSequence = getRowSequence(line);
            let row = 0;
            Array.from(rowSequence).forEach(char => {
                if (char === 'F') {
                    numRows /= 2;
                } else if (char === 'B') {
                    numRows /= 2;
                    startRow += numRows;
                }
            });
            if (rowSequence[rowSequence.length - 1] === 'F') {
                row = startRow;
            } else if (rowSequence[rowSequence.length - 1] === 'B') {
                row = startRow + numRows - 1;
            }

            let numCols = 8;
            let startCol = 0;
            const colSequence = getColSequence(line);
            let col = 0;
            Array.from(colSequence).forEach(char => {
                if (char === 'L') {
                    numCols /= 2;
                } else if (char === 'R') {
                    numCols /= 2;
                    startCol += numCols;
                }
            });
            if (colSequence[colSequence.length - 1] === 'L') {
                col = startCol;
            } else if (colSequence[colSequence.length - 1] === 'R') {
                col = startCol + numCols - 1;
            }

            input.push({
                row,
                col
            });
        });

        readInterface.on('close', () => {
            debug('done reading lines', input);
            resolve(input);
        })
    })
}

function getRowSequence(line) {
    return line.substr(0, line.length - 3);
}

function getColSequence(line) {
    return line.substr(line.length - 3);
}

function solve(input) {
    const allSeats = input.map(({ row, col }) => row * 8 + col);
    const maxId = 128 * 8;

    let result = 0;
    for (let id = 1; id < maxId - 1; id++) {
        if (
            allSeats.indexOf(id) < 0 &&
            allSeats.indexOf(id - 1) >= 0 &&
            allSeats.indexOf(id + 1) >= 0
        ) {
            result = id;
            break;
        }
    }

    return result;
}

module.exports = {
    readFile,
    solve
}