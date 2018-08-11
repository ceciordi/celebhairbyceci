import {isNumber} from 'fjl';
export const

    wrapPointer = (min: number, max: number, x: number) => {
        if (x < min) { return min; }
        if (x > max) { return max; }
        return x;
    },

    constrainPointer = (min: number, max: number, x: number) => {
        if (x < min) { return max; }
        if (x > max) { return min; }
        return x;
    },

    resolvePointer = (autoWrap: boolean, min: Num, max: Num, pointer: Num) => {
        return (autoWrap ? wrapPointer : constrainPointer)(
            isNumber(min) ? min : 0,
            isNumber(max) ? max : Number.MAX_SAFE_INTEGER,
            pointer
        );
    }
;
