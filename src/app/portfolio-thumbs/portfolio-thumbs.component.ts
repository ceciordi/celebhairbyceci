import {Component, OnInit, QueryList, ViewChildren, ElementRef, Input, Output, EventEmitter} from '@angular/core';
import {log, findIndex} from 'fjl';

@Component({
    selector: 'app-portfolio-thumbs',
    templateUrl: './portfolio-thumbs.component.html',
    styleUrls: ['./portfolio-thumbs.component.scss']
})
export class PortfolioThumbsComponent implements OnInit {
    @ViewChildren('imageWithLoader', {read: ElementRef}) childNodes: QueryList<ElementRef>;
    @Input() items: Array<Object> = [];
    @Input() activeImageIndex: number;
    @Input() activeClassName = 'active';
    @Output() thumbclick = new EventEmitter<any>();
    constructor() {}

    ngOnInit() {}

    onThumbClick (e, $item) {
        const {activeClassName, childNodes} = this,
            elm = e.currentTarget,
            {filePath} = $item,
            imgIndex = findIndex(x => x && x.filePath === filePath, this.items),
            detail = {index: imgIndex};
        if (elm.classList.contains(activeClassName)) {
            return;
        }
        childNodes.forEach(x => {
            x.nativeElement.classList.remove(activeClassName);
        });
        elm.classList.add(activeClassName);
        this.thumbclick.emit(detail);
    }

}
