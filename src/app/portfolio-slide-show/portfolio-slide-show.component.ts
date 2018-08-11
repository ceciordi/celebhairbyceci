import {Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';

@Component({
  selector: 'app-portfolio-slide-show',
  templateUrl: './portfolio-slide-show.component.html',
  styleUrls: ['./portfolio-slide-show.component.scss']
})
export class PortfolioSlideShowComponent implements OnInit {
    @Input() items: Array<Object> = [];
    @Input() activeImageIndex = 0;
    @Input() activeClassName = 'active';
    @ViewChildren('imageWithLoader', {read: ElementRef}) childNodes: QueryList<ElementRef>;
    @Output() close = new EventEmitter<any>();
    constructor() {

    }

    ngOnInit() {

    }

    closeSlideShow () {
        this.close.emit(null);
    }

}
