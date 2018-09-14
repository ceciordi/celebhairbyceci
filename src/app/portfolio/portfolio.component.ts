import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PortfolioServiceService} from '../portfolio-service.service';
import {error, findIndex, noop, log, assign, last, compose, forEach} from 'fjl';
import {fromEvent} from 'rxjs';
import StaticPaginator from '../utils/StaticPaginator';
import {hasClass, addClass, removeClass} from '../utils/classList-helpers';

@Component({
    selector: 'app-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
    @ViewChild('slideShow', {read: ElementRef}) slideShow: ElementRef;
    @ViewChild('bgOverlay', {read: ElementRef}) bgOverlay: ElementRef;
    private slideShowImageSize = 987;
    private thumbImageSize = 377;
    private slidesPaginator = new StaticPaginator({
        autoUpdatePageNumber: false
    }); // slides pagination math and triggering handed off to this component
    activeClassName = 'active';
    hiddenByClassName = 'hidden-by-z-index';
    activeImageItemIndex = -1;
    thumbImages: Array<ImageWithLoaderModel> = [];
    slideShowImages: Array<ImageWithLoaderModel> = [];

    constructor(private portfolioService: PortfolioServiceService) {
        this.slideShowImageSize = last(portfolioService.sizes);
        const {thumbImageSize, slideShowImageSize} = this,
            escapeKeyName = 'escape';

        // Set thumb and slide images as well as `slides paginator.items`
        this.portfolioService.fetchImages()
            .then(imagesBySize => {
                this.thumbImages = imagesBySize[thumbImageSize];
                this.slidesPaginator.items =
                    this.slideShowImages =
                        imagesBySize[slideShowImageSize];
            })
            .catch(error);

        fromEvent(window, 'keyup')
            .subscribe((e: KeyboardEvent) => {
                if (e.key.toLowerCase() === escapeKeyName) {
                    this.closeSlideShow();
                }
            });
    }

    ngOnInit() {
    }

    openSlideShow ({index}) {
        const {activeClassName, hiddenByClassName,
                bgOverlay, slideShow} = this;
        this.gotoSlide(index);
        if (hasClass(activeClassName, slideShow)) {
            return;
        }
        forEach(compose(
            addClass(activeClassName),
            removeClass(hiddenByClassName)
            ), [bgOverlay, slideShow]);
    }

    closeSlideShow () {
        const {activeClassName, bgOverlay, slideShow} = this;
        forEach(removeClass(activeClassName), [bgOverlay, slideShow]);
    }

    nextSlide () {
        this.slidesPaginator.nextItem();
        this.activeImageItemIndex =
            this.slidesPaginator.itemNumber
        ;
    }

    prevSlide () {
        this.slidesPaginator.prevItem();
        this.activeImageItemIndex =
            this.slidesPaginator.itemNumber
        ;
    }

    gotoSlide (ind) {
        this.activeImageItemIndex =
            this.slidesPaginator
                .gotoItem(ind)
                .itemNumber
        ;
    }

    /**
     * Handle transition end for 'bg-overlay' and 'slide-show' components
     *  (pretty much just toggling some classes when transition end happens)
     * @param e {TransitionEvent}
     */
    onOverlayTransitionEnd (e) {
        const {slideShow, bgOverlay, activeClassName, hiddenByClassName} = this;
        if (e.currentTarget.nodeName.toLowerCase() === 'app-image-with-loader') {
            return;
        }
        if (!hasClass(activeClassName, slideShow)) {
            forEach(addClass([hiddenByClassName, 'from-closed']),
                [bgOverlay, slideShow]);
        } else {
            removeClass('from-closed', slideShow);
        }
    }

}
