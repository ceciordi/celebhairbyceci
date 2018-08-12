import {
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
import {findIndex, isset} from 'fjl';
import {fromEvent} from 'rxjs';

@Component({
  selector: 'app-portfolio-slide-show',
  templateUrl: './portfolio-slide-show.component.html',
  styleUrls: ['./portfolio-slide-show.component.scss']
})
export class PortfolioSlideShowComponent implements OnInit, OnChanges {
    @ViewChild('carouselContainer', {read: ElementRef}) carouselContainer: ElementRef;
    @ViewChild('carouselItems', {read: ElementRef}) carouselItems: ElementRef;
    @ViewChildren('imageWithLoader', {read: ElementRef}) childNodes: QueryList<ElementRef>;
    @Input() items: Array<Object> = [];
    @Input() activeImageIndex = 0;
    @Input() activeClassName = 'active';
    @Output() close = new EventEmitter<any>();
    @Output() nextslide = new EventEmitter<any>();
    @Output() prevslide = new EventEmitter<any>();
    @Output() gotoslide = new EventEmitter<Num>();
    @Output() selftransitionend = new EventEmitter<any>();
    constructor() {}

    ngOnInit() {
        fromEvent(this.carouselItems.nativeElement, 'transitionend')
            .subscribe((e: TransitionEvent) => {
                const elm = e.currentTarget as HTMLElement;
                    if (!elm.classList.contains('carousel-items')) {
                        return;
                    }
                    this.selftransitionend.emit(e);
                });
    }

    ngOnChanges (changes: SimpleChanges) {
        if (!isset(changes.activeImageIndex)) {
            return;
        }
        const {currentValue, previousValue, firstChange} = changes.activeImageIndex;
        if (currentValue === previousValue || firstChange) {
            return;
        }
        this.gotoSlide(currentValue);
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
        const {activeClassName} = this;
        this.childNodes.forEach(x => x.nativeElement.classList.remove(activeClassName));
        elm.classList.add(activeClassName);
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

}
