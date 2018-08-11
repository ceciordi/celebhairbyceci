import {isNumber} from 'fjl';

export const

    constrainPointer = (min: Num, max: Num, x: Num) => {
        if (x < min) { return min; }
        if (x > max) { return max; }
        return x;
    },

    wrapPointer = (min: Num, max: Num, x: Num) => {
        if (x < min) { return max; }
        if (x > max) { return min; }
        return x;
    },

    resolvePointer = (autoWrap: boolean, min: Num, max: Num, pointer: Num) => {
        return (autoWrap ? wrapPointer : constrainPointer)(min, max, pointer);
    }
;
