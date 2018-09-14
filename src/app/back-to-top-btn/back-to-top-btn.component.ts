import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {scrollWindowTo} from '../utils/scrollTo';

@Component({
    selector: 'app-back-to-top-btn',
    templateUrl: './back-to-top-btn.component.html',
    styleUrls: ['./back-to-top-btn.component.scss']
})
export class BackToTopBtnComponent implements OnInit, AfterViewInit {
    activeClassName = 'active';
    posRelClassName = 'pos-rel';
    transitionNoneStyle = 'none';
    // hard-coding transition here for now
    originalTransition = 'transform 0.34s, opacity 0.34s';
    readonly element: ElementRef;

    constructor(private elm: ElementRef) {
        this.element = elm;
    }

    ngAfterViewInit() {
        const
            btnElm = this.element.nativeElement,
            wrapperElm: HTMLElement = document.querySelector('#wrapper'),
            footerElm: HTMLElement = wrapperElm.querySelector('footer'),
            headerElm: HTMLElement = wrapperElm.querySelector('header'),
            {activeClassName, posRelClassName, transitionNoneStyle, originalTransition} = this,
            scrollHandler = () => {
                const
                    scrollTop = document.body.scrollTop ||
                        document.documentElement.scrollTop,
                    topActiveOffset = headerElm.offsetHeight,
                    footerOffsetTop = footerElm.offsetTop,
                    winHeight = window.innerHeight,
                    scrollBottom = winHeight + scrollTop,
                    classList = btnElm.classList;

                // Toggle active class
                if (scrollTop > topActiveOffset && !classList.contains(activeClassName)) {
                    btnElm.style.transition = originalTransition;
                    classList.add(activeClassName);
                } else if (scrollTop < topActiveOffset) {
                    btnElm.style.transition = originalTransition;
                    classList.remove(activeClassName);
                }

                // Toggle position fixed (when btn hits footer)
                if (!classList.contains(posRelClassName) && scrollBottom >= footerOffsetTop) {
                    btnElm.style.transition = transitionNoneStyle;
                    classList.add(posRelClassName);
                } else if (classList.contains(posRelClassName) && scrollBottom < footerOffsetTop) {
                    classList.remove(posRelClassName);
                    btnElm.style.transition = transitionNoneStyle;
                }
            };

        window.addEventListener('scroll', scrollHandler);
        window.addEventListener('orientationchange', scrollHandler);
        window.addEventListener('resize', scrollHandler);
    }

    ngOnInit() {
    }

    onClick(e) {
        e.preventDefault();
        // window.scroll(0, 0);
        scrollWindowTo(0, 1000, 'easeOutQuad');
    }

}
