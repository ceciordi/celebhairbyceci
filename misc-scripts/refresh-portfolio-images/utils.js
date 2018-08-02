
const

    {isNumber} = require('fjl'),

    isUsablePosNum = num => isNumber(num) && num > -1,

    closestPairAscFromFib = num => {
        let out,
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
    },

    fib = (start, end) => {
        start = isUsablePosNum(start) ? start : 0;
        end = isUsablePosNum(end) ? end : 1000;
        let out = [],
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
    },

    ratio = (a, b, c) => b * c / a

;

module.exports = {
    isUsablePosNum,
    closestPairAscFromFib,
    fib,
    ratio
};
