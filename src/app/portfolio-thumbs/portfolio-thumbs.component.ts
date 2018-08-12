import {Component, OnInit, QueryList, ViewChildren, ElementRef, Input, Output, EventEmitter, SimpleChanges, OnChanges} from '@angular/core';
import {log, findIndex, isset} from 'fjl';

@Component({
    selector: 'app-portfolio-thumbs',
    templateUrl: './portfolio-thumbs.component.html',
    styleUrls: ['./portfolio-thumbs.component.scss']
})
export class PortfolioThumbsComponent implements OnInit, OnChanges {
    @ViewChildren('imageWithLoader', {read: ElementRef}) childNodes: QueryList<ElementRef>;
    @Input() items: Array<Object> = [];
    @Input() activeImageIndex: number;
    @Input() activeClassName = 'active';
    @Output() thumbclick = new EventEmitter<any>();
    constructor() {}

    ngOnInit() {}

    ngOnChanges (changes: SimpleChanges) {
        if (!isset(changes.activeImageIndex)) {
            return;
        }
        const {currentValue, firstChange} = changes.activeImageIndex;
        if (firstChange) {
            return;
        }
        this.setActiveThumbByIndex(currentValue);
    }

    setActiveThumbByIndex (ind) {
        const elmRef = this.childNodes.find((x, i) => i === ind);
        if (elmRef) {
            this.setActiveThumb(elmRef.nativeElement);
        }
    }

    setActiveThumb (thumbElm) {
        const {activeClassName, childNodes} = this;
        if (thumbElm.classList.contains(activeClassName)) {
            return;
        }
        childNodes.forEach(x => {
            x.nativeElement.classList.remove(activeClassName);
        });
        thumbElm.classList.add(activeClassName);
    }

    onThumbClick (e, $item) {
        const elm = e.currentTarget,
            {filePath} = $item,
            imgIndex = findIndex(x => x && x.filePath === filePath, this.items),
            detail = {index: imgIndex};
        this.setActiveThumb(elm);
        this.thumbclick.emit(detail);
    }

}
