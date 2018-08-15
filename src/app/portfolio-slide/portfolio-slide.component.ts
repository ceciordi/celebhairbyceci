import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {log} from 'fjl';
import {fromEvent} from 'rxjs';
@Component({
  selector: 'app-portfolio-slide',
  templateUrl: './portfolio-slide.component.html',
  styleUrls: ['./portfolio-slide.component.scss']
})
export class PortfolioSlideComponent implements OnInit {
    @Input() dataSrc: string;
    @Input() triggerLoadRequested = false;
    @Input() index: number;
    @Input() className = '';
    @Input() alt = 'Image description here';
    @Output() imageWithPreloaderClick = new EventEmitter<object>();

    private element: ElementRef;

    constructor(private selfRef: ElementRef) {
        this.element = selfRef;
    }

    ngOnInit() {
        const {dataSrc, element} = this;
        fromEvent(element.nativeElement, 'click')
            .subscribe(() => {
                this.imageWithPreloaderClick.emit({
                    detail: {dataSrc}
                });
            });
    }

    onImageLoadStateChange (loadstate) {
        switch (loadstate) {
            case 0:
                // log('Load started');
                this.element.nativeElement.setAttribute('data-loaded', '');
                break;
            case 1:
            default:
                // log('Load completed');
                this.element.nativeElement.setAttribute('data-loaded', 'data-loaded');
                break;
        }
    }

    onImageWithLoaderClick ($event) {
        const {dataSrc, index} = this;
        this.imageWithPreloaderClick.emit({detail: {dataSrc, index}});
    }

}
