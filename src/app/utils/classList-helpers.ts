import {isArray, curry, instanceOf, forEach, apply} from 'fjl';
import {elementFrom} from './dom-helpers';

const

    _classListOp: (opName: string) => Function =
        opName => curry((cssClassName, elm) => {
            const e = elementFrom(elm);
            apply(
                e.classList[opName].bind(e.classList),
                isArray(cssClassName) ? cssClassName : [cssClassName]
            );
            return elm;
        });

export const

    hasClass = (cssClassName, elm) =>
        elementFrom(elm).classList
            .contains(cssClassName)
    ,

    addClass = _classListOp('add'),

    removeClass = _classListOp('remove'),

    toggleClass = _classListOp('toggle')

;
