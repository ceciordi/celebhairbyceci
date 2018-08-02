'use strict';

let sjl = require('sjljs');

function isUsablePosNum (num) {
    return sjl.isNumber(num) && num > -1;
}

function closestPairAscFromFib (num) {
    var out,
        a = 0,
        b = 1,
        c = a + b;
    while (b < num) {
        a = a + b;
        b = a + b;
        c = a + b;
        if (b >= num) {
            out = [b, c];
            break;
        }
    }
    return out;
}

function fib (start, end) {
    start = isUsablePosNum(start) ? start : 0;
    end = isUsablePosNum(end) ? end : 1000;
    var out = [],
        fibPair = closestPairAscFromFib(start),
        a = fibPair[0],
        b = fibPair[1];
    while (a < end) {
        if (a < end) {
            out.push(a);
        }
        if (b < end)  {
            out.push(b);
        }
        a = a + b;
        b = a + b;
    }
    return out;
}

function ratio (a, b, c) {
    return b * c / a;
}

module.exports = {
    isUsablePosNum: isUsablePosNum,
    closestPairAscFromFib: closestPairAscFromFib,
    fib: fib,
    ratio: ratio
};
