import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PortfolioServiceService} from '../portfolio-service.service';
import {error, findIndex, noop, log, assign} from 'fjl';
import {fromEvent} from 'rxjs';
import StaticPaginator from '../utils/StaticPaginator';

@Component({
    selector: 'app-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
    @ViewChild('slideShow', {read: ElementRef}) slideShow: ElementRef;
    @ViewChild('bgOverlay', {read: ElementRef}) bgOverlay: ElementRef;
    private portfolioImageSize = [55, 89, 144, 233, 377, 610, 987];
    private slideShowImageSize = 1587;
    private thumbImageSize = 377;
    private slidesPaginator = new StaticPaginator();
    activeClassName = 'active';
    hiddenByClassName = 'hidden-by-z-index';
    activeImageItemIndex = 0;
    thumbImages: object[] = [];
    slideShowImages: object[] = [];
    constructor(private portfolioService: PortfolioServiceService) {
        assign(this.slidesPaginator, {
            onGotoItem: ind => (log(ind), this.gotoSlide(ind)),
            onGotoPage: ind => (log(ind), this.gotoSlide(ind))
        });
    }

    ngOnInit() {
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

    openSlideShow (detail) {
        const {classList: slideShowClassList} = this.slideShow.nativeElement,
            {classList: bgOverlayClassList} = this.bgOverlay.nativeElement,
            {activeClassName, hiddenByClassName} = this,
            {index} = detail;
        // this.activeImageItemIndex = index;
        this.slidesPaginator.gotoItem(index);
        if (slideShowClassList.contains(activeClassName)) {
            return;
        }
        slideShowClassList.remove(hiddenByClassName);
        bgOverlayClassList.remove(hiddenByClassName);
        slideShowClassList.add(activeClassName);
        bgOverlayClassList.add(activeClassName);
    }

    closeSlideShow () {
        const {classList: slideShowClassList} = this.slideShow.nativeElement,
            {classList: bgOverlayClassList} = this.bgOverlay.nativeElement,
            {activeClassName, hiddenByClassName} = this;
        slideShowClassList.remove(activeClassName);
        bgOverlayClassList.remove(activeClassName);
        slideShowClassList.add(hiddenByClassName);
        bgOverlayClassList.add(hiddenByClassName);
    }

    setActiveThumbByIndex (ind) {
    }

    setActiveSlideByIndex (ind) {
        this.slidesPaginator.gotoItem(ind);
    }

    nextSlide () {
        this.slidesPaginator.nextItem();
    }

    prevSlide () {
        this.slidesPaginator.prevItem();
    }

    gotoSlide (ind) {
        log ('Going to slide num:', ind);
        this.activeImageItemIndex = ind;
    }

}
