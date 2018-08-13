import {foldl1, map, filter, compose, tail, head} from 'fjl';
import {isElementRef} from './isElementRef';

export const

    elementFrom = x => isElementRef(x) ? x.nativeElement : x,

    areElementsEqual = (a, b) => elementFrom(a) === elementFrom(b),

    getDocumentTopScrollable = win => compose(
            head,
            tail,
            foldl1((chosen, incoming) => {
                const [cHeight, _] = chosen,
                    [iHeight, __] = incoming;
                return cHeight > iHeight ? chosen : incoming;
            }),
            map(x => [x.scrollHeight, x]),
            filter(Boolean)
        )([win.document.scrollingElement,
           win.document.documentElement,
           win.document.body
       ])
;
