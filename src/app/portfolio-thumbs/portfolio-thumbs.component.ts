import {
    AfterViewInit,
    Component,
    DoCheck,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    QueryList,
    SimpleChange,
    SimpleChanges,
    ViewChildren
} from '@angular/core';
import {findIndex, isset, log} from 'fjl';
import {imageWithLoaderLazyLoadWatcher, loadTriggerCheck} from '../utils/imageWithLoaderParent-helpers';
import {getDocumentTopScrollable} from '../utils/dom-helpers';

@Component({
    selector: 'app-portfolio-thumbs',
    templateUrl: './portfolio-thumbs.component.html',
    styleUrls: ['./portfolio-thumbs.component.scss']
})
export class PortfolioThumbsComponent implements OnChanges, AfterViewInit {
    @ViewChildren('imageWithLoader', {read: ElementRef}) childNodes: QueryList<ElementRef>;
    @Input() items: Array<ImageWithLoaderModel> = [];
    @Input() activeImageIndex: number;
    @Input() activeClassName = 'active';
    @Output() thumbclick = new EventEmitter<any>();
    docScrollableElm: HTMLElement = getDocumentTopScrollable(window);

    ngOnChanges (changes: SimpleChanges) {
        this.handleActiveImageIndexChange(changes.activeImageIndex);
    }

    handleActiveImageIndexChange (activeImageIndex: SimpleChange | undefined) {
        if (!isset(activeImageIndex)) {
            return;
        }
        const {currentValue, firstChange} = activeImageIndex;
        if (firstChange) {
            return;
        }
        this.setActiveThumbByIndex(currentValue);
    }

    ngAfterViewInit () {
        const handler = () => {
            if (!this.childNodes || !this.childNodes.length) {
                return;
            }
            loadTriggerCheck(this.items, this.childNodes, this.docScrollableElm);
        };
        imageWithLoaderLazyLoadWatcher(handler);
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
