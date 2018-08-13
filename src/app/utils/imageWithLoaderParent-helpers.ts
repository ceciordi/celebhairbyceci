import {ElementRef, QueryList} from '@angular/core';
import {curry, or} from 'fjl';
import {fromEvent} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

export const

    imageWithLoaderLazyLoadWatcher = (handler) => {
        fromEvent(window, 'scroll')
            .pipe(debounceTime(300))
            .subscribe(handler);

        fromEvent(window, 'orientationchange')
            .pipe(debounceTime(100))
            .subscribe(handler);

        fromEvent(window, 'resize')
            .pipe(debounceTime(500))
            .subscribe(handler);

        fromEvent(window, 'load')
            .pipe(debounceTime(500))
            .subscribe(handler);
    },

    loadTriggerCheck: (
        childNodeDataObjects: Array<ImageWithLoaderModel>,
        childNodes: QueryList<ElementRef>,
        containerElm: HTMLElement
    ) => ElementRef[] = curry((
        childNodeDataObjects, childNodes, containerElm
    ) => {
        const {scrollLeft: topScrollLeft, scrollTop: topScrollTop} = containerElm,
            {innerWidth, innerHeight} = window;
        // @todo return reduced list
        return childNodes.filter((ref, ind) => {
            if (ref.nativeElement.dataset.loaded) {
                return false;
            }
            const elm = ref.nativeElement as HTMLElement,
                {top, left, bottom, right} = elm.getBoundingClientRect(),
                {offsetWidth, offsetHeight} = elm,
                halfOffsetH = offsetHeight / 2,
                halfOffsetW = offsetWidth / 2,
                nearTop = top > topScrollTop - (offsetHeight + halfOffsetH),
                nearBottom = bottom < topScrollTop + innerHeight + offsetHeight + halfOffsetH,
                nearLeft = left > topScrollLeft - (offsetWidth + halfOffsetW),
                nearRight = right < topScrollLeft + innerWidth + offsetWidth + halfOffsetW,
                readyForLoadTrigger =  nearTop && nearBottom &&  nearRight && nearLeft,
                item = childNodeDataObjects[ind];

            if (readyForLoadTrigger && item) {
                item.triggerLoadRequested = true;
            }

            // Return items still awaiting 'triggerLoadRequested' to be set
            return !readyForLoadTrigger;
        });
    })

;

