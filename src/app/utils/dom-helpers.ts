import {isElementRef} from './isElementRef';

export const

    elementFrom = x => isElementRef(x) ? x.nativeElement : x,

    areElementsEqual = (a, b) => elementFrom(a) === elementFrom(b)

;
