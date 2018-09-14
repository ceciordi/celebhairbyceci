import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {findIndex, isset, forEach, compose} from 'fjl';
import {fromEvent} from 'rxjs';
import {addClass, removeClass} from '../utils/classList-helpers';
import {debounceTime} from 'rxjs/operators';
import {getDocumentTopScrollable} from '../utils/dom-helpers';
import {assign} from 'fjl';
import {loadTriggerCheck} from '../utils/imageWithLoaderParent-helpers';
@Component({
  selector: 'app-portfolio-slide-show',
  templateUrl: './portfolio-slide-show.component.html',
  styleUrls: ['./portfolio-slide-show.component.scss']
})
export class PortfolioSlideShowComponent implements OnInit, OnChanges, AfterViewInit {
    @ViewChild('carouselContainer', {read: ElementRef}) carouselContainer: ElementRef;
    @ViewChild('carouselItems', {read: ElementRef}) carouselItems: ElementRef;
    @ViewChildren('imageWithLoader', {read: ElementRef}) childNodes: QueryList<ElementRef> = new QueryList();
    @Input() items: Array<ImageWithLoaderModel> = [];
    @Input() activeImageIndex = 0;
    @Input() activeClassName = 'active';
    @Output() close = new EventEmitter<any>();
    @Output() nextslide = new EventEmitter<any>();
    @Output() prevslide = new EventEmitter<any>();
    @Output() gotoslide = new EventEmitter<Num>();
    @Output() selftransitionend = new EventEmitter<any>();
    private element: ElementRef;
    constructor(private selfRef: ElementRef) {
        this.element = selfRef;
    }

    ngOnInit() {
        const resizeDebounceTime = debounceTime(300),
            resizeHandler = () => {
                this.gotoSlide(this.activeImageIndex);
            },
            imgLazyLoadCheckHandler = e => {
                const elm = e.currentTarget as HTMLElement;
                if (elm && !elm.classList.contains('carousel-items')) {
                    return;
                }
                this.imageLazyLoadCheck();
            };

        fromEvent(this.element.nativeElement, 'transitionend')
            .subscribe(imgLazyLoadCheckHandler);

        fromEvent(this.carouselItems.nativeElement, 'transitionend')
            .subscribe((e: TransitionEvent) => {
                imgLazyLoadCheckHandler(e);
                this.selftransitionend.emit(e);
            });

        // Handle resize
        fromEvent(window, 'resize')
            .pipe(resizeDebounceTime)
            .subscribe(() => {
                resizeHandler();
                this.imageLazyLoadCheck();
            });

        // Handle orientation change
        if (window.onorientationchange) {
            fromEvent(window, 'orientationchange')
                .pipe(resizeDebounceTime)
                .subscribe(() => {
                    resizeHandler();
                    this.imageLazyLoadCheck();
                });
        }
    }

    ngOnChanges (changes: SimpleChanges) {
        if (!isset(changes.activeImageIndex)) {
            return;
        }
        const {currentValue, firstChange} = changes.activeImageIndex;
        if (firstChange) {
            return;
        }
        this.gotoSlide(currentValue);
    }

    ngAfterViewInit () {
        window.addEventListener('keydown', e => {
            switch (e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                default:
                    break;
            }
        });
    }

    imageLazyLoadCheck () {
        if (!this.childNodes || !this.childNodes.length) {
            return;
        }
        loadTriggerCheck(this.items, this.childNodes, getDocumentTopScrollable(window));
    }

    nextSlide () {
        this.nextslide.emit(null);
    }

    prevSlide () {
        this.prevslide.emit(null);
    }

    gotoSlide (ind) {
        const {childNodes, carouselItems, carouselContainer} = this,
            scrollableElm = carouselContainer.nativeElement,
            itemsElm = carouselItems.nativeElement,
            $item = childNodes.find((x, i) => i === ind).nativeElement,
            $itemOffsetActiveScale = 0.10,
            $itemOffsetScaleDiff = $item.offsetWidth * $itemOffsetActiveScale,
            itemOffsetWidth = $item.offsetWidth + $itemOffsetScaleDiff,
            offsetLeft = $item.offsetLeft + itemOffsetWidth - ($itemOffsetScaleDiff / 2),
            itemCenter = itemOffsetWidth / 2,
            scrollableElmCenter = scrollableElm.offsetWidth / 2,
            newTranslateX = -offsetLeft + scrollableElmCenter + itemCenter;
        this.setActiveSlideElm($item);
        itemsElm.style.transform = 'translateX(' + newTranslateX + 'px)';
    }

    setActiveSlideElm (elm) {
        const {activeClassName, childNodes} = this;
        childNodes.forEach(removeClass(activeClassName));
        addClass(activeClassName, elm);
    }

    closeSlideShow () {
        this.close.emit(null);
    }

    onSlideClick ({detail: {dataSrc}}) {
        const ind = findIndex(x => x.filePath === dataSrc, this.items);
        if (!isset(ind)) {
            return;
        }
        this.gotoslide.emit(ind);
    }

    onCarouselItemsClick (e) {
        // If '.carousel-items' itself was click,
        //  close slide show
        if (e.target === e.currentTarget) {
            this.closeSlideShow();
        }
    }

}
