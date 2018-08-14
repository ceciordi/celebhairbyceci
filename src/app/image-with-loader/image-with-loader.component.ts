import {
    AfterViewChecked,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import {assign, isNumber, isset, compose, log} from 'fjl';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {addClass, removeClass} from '../utils/classList-helpers';

@Component({
    selector: 'app-image-with-loader',
    templateUrl: './image-with-loader.component.html',
    styleUrls: ['./image-with-loader.component.scss']
})
export class ImageWithLoaderComponent implements OnInit, OnChanges, AfterViewChecked {
    readonly element: ElementRef;
    private xhr = new XMLHttpRequest();
    @Input() dataSrc: string;
    @Input() triggerLoadRequested = false;
    @Input() index: number;
    @Input() width = '100%';
    @Input() height = '';
    @Input() alt = 'Image description here';
    src: SafeResourceUrl;
    loading = false;
    loaded = false;
    progress = 0;
    progressText = '';
    @Output() loadstate = new EventEmitter<Num>();

    constructor(private sanitizer: DomSanitizer, private selfRef: ElementRef) {
        this.element = selfRef;
    }

    ngOnInit() {
        const {dataSrc, element} = this;
        this.initXHR();
        if (this.triggerLoadRequested) {
            this.loadSrc(dataSrc);
        }
        addClass('not-loaded', element);
    }

    ngOnChanges (changes: SimpleChanges) {
        const {loaded, dataSrc} = this,
            {triggerLoadRequested} = changes;
        if (loaded) {
            return;
        }
        if (triggerLoadRequested && triggerLoadRequested.currentValue) {
            this.loadSrc(dataSrc);
        }
    }

    ngAfterViewChecked () {
        const {loaded, element} = this;
        if (loaded) {
            removeClass('not-loaded', element);
        }
    }

    initXHR () {
        const self = this,
            {xhr} = self;
        xhr.responseType = 'blob';
        xhr.addEventListener('loadstart', self.onLoadStart.bind(self));
        xhr.addEventListener('progress', self.onProgress.bind(self));
        // xhr.addEventListener('loadend', self.onLoadEnd.bind(self));
        xhr.addEventListener('load', self.onLoad.bind(self));
        xhr.addEventListener('error', self.onError.bind(self));
        xhr.addEventListener('abort', self.onAbort.bind(self));
    }

    loadSrc (src) {
        this.xhr.abort();
        this.xhr.open('GET', src, true);
        this.loaded = false;
        this.loading = true;
        this.progress = 0;
        this.xhr.send();
    }

    onLoadStart () {
        this.progressText = 'Awaiting load queue...';
        this.loadstate.emit(0);
    }

    onProgress (e) {
        if (e && e.lengthComputable) {
            const expectedProgress = e.loaded / e.total,
                progress = isNumber(expectedProgress) ? expectedProgress : 0;
            this.progressText = Math.round((progress * 100)) + '%';
        }
    }

    onLoad () {
        this.src = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(this.xhr.response));
        this.loading = false;
        this.loaded = true;
        this.loadstate.emit(1);
        this.element.nativeElement.setAttribute('data-loaded', 'data-loaded');
    }

    // onLoadEnd () {
    //     this.progressText = 'Load ended.';
    // }

    onAbort () {
        this.progressText = 'Image loading aborted.';
    }

    onError () {
        this.progressText = 'Unable to load image.';
    }
}
