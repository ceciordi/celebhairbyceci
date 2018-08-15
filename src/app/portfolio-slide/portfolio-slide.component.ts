import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {log} from 'fjl';
import {fromEvent} from 'rxjs';
import {addClass, hasClass, removeClass} from '../utils/classList-helpers';
import {offsetsToViewMeasurements} from '../utils/math';
import {LOAD_STATE} from '../image-with-loader/image-with-loader.component';

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
        const {element: {nativeElement}} = this;
        switch (loadstate) {
            case LOAD_STATE.LOAD_START:
                nativeElement.setAttribute('data-loaded', undefined);
                break;
            case LOAD_STATE.LOAD_LOAD:
            default:
                nativeElement.setAttribute('data-loaded', 'data-loaded');
                break;
        }
    }

    onImageWithLoaderClick () {
        const {dataSrc, index} = this;
        this.imageWithPreloaderClick.emit({detail: {dataSrc, index}});
    }

    onTransitionEnd (e) {
        const {target, currentTarget} = e,
            {element} = this;
        if (!hasClass('preload-overlay', target)) {
            return;
        }
        if (!hasClass('not-loaded', currentTarget) && currentTarget.dataset.loaded) {
            // const {vw, vh} = offsetsToViewMeasurements(currentTarget, window);
            // currentTarget.style.height = `${vh}vh`;
            // currentTarget.style.width = `${vw}vw`;
            addClass('loaded', currentTarget);
            addClass('loaded', element);
        }
    }
}
