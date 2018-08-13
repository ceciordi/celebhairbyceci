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
    ) => ImageWithLoaderModel[] = curry((
        childNodeDataObjects: Array<ImageWithLoaderModel>,
        childNodes: QueryList<ElementRef>,
        containerElm: HTMLElement
    ) => {
        const {scrollLeft: topScrollLeft, scrollTop: topScrollTop} = containerElm,
            {innerWidth, innerHeight} = window;
        // @todo return reduced list
        return childNodes.forEach((x, ind) => {
            if (x.nativeElement.dataset.loaded) {
                return false;
            }
            const elm = x.nativeElement as HTMLElement,
                {top, left, bottom, right} = elm.getBoundingClientRect(),
                {offsetWidth, offsetHeight} = elm,
                nearTop = top > topScrollTop - offsetHeight,
                nearBottom = bottom < topScrollTop + innerHeight + offsetHeight,
                nearLeft = left > topScrollLeft - offsetWidth,
                nearRight = right < topScrollLeft + innerWidth + offsetWidth,
                readyForLoadTrigger =  nearTop && nearBottom &&  nearRight && nearLeft,
                item = childNodeDataObjects[ind];

            if (readyForLoadTrigger && item) {
                item.triggerLoadRequested = true;
            }
        });
    })

;

