import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {assign, isNumber} from 'fjl';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {fromEvent} from 'rxjs';

@Component({
    selector: 'app-image-with-loader',
    templateUrl: './image-with-loader.component.html',
    styleUrls: ['./image-with-loader.component.scss']
})
export class ImageWithLoaderComponent implements OnInit {
    private selfRef: ElementRef;
    @Input() dataSrc: string;
    private xhr = new XMLHttpRequest();
    alt = 'Image description here';
    src: SafeResourceUrl;
    loading = false;
    progress = 0;
    progressText = 'loading';
    @Output() imageWithPreloaderClick = new EventEmitter<object>();

    constructor(private sanitizer: DomSanitizer, private element: ElementRef) {
        this.selfRef = element;
    }

    ngOnInit() {
        this.initXHR();
        fromEvent(this.selfRef.nativeElement, 'click')
            .subscribe(() => {
                this.imageWithPreloaderClick.emit({
                    detail: {
                        dataSrc: this.dataSrc
                    }
                });
            });
    }

    initXHR () {
        const self = this,
            {xhr} = self;
        xhr.responseType = 'blob';
        xhr.addEventListener('loadstart', self.onLoadStart.bind(self));
        xhr.addEventListener('progress', self.onProgress.bind(self));
        xhr.addEventListener('loadend', self.onLoadEnd.bind(self));
        xhr.addEventListener('load', self.onLoad.bind(self));
        xhr.addEventListener('error', self.onError.bind(self));
        xhr.addEventListener('abort', self.onAbort.bind(self));
        self.loadSrc(self.dataSrc);
    }

    loadSrc (src) {
        this.xhr.abort();
        this.xhr.open('GET', src, true);
        this.loading = true;
        this.progress = 0;
        this.xhr.send();
    }

    onLoadStart () {
        this.progressText = '0%';
        this.selfRef.nativeElement.classList.add('loading');
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
        this.selfRef.nativeElement.classList.remove('loading');
    }

    onLoadEnd () {
        // this.progressText = 'Load ended';
    }

    onAbort () {
        this.progressText = 'Image loading aborted.';
    }

    onError () {
        this.progressText = 'Unable to load image.';
    }

}
