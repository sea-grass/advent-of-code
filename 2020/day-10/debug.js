const DEBUG = true;

function wrap(fn) {
    if (DEBUG) {
        return function () {
            const result = fn.apply(null, arguments);
            debug(fn.name, arguments, result);
            return result;
        }
    }
    else {
        return fn;
    }
}

function debug() {
    if (DEBUG) console.log.apply(console, arguments);
}

module.exports = {
    wrap,
    debug
}