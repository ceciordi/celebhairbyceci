import {Component, Input, OnInit} from '@angular/core';
import {assign, isNumber} from 'fjl';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
    selector: 'app-image-with-loader',
    templateUrl: './image-with-loader.component.html',
    styleUrls: ['./image-with-loader.component.scss']
})
export class ImageWithLoaderComponent implements OnInit {
    @Input() dataSrc: string;
    private xhr = new XMLHttpRequest();
    private defaultClassName = 'image-with-preloader';
    readonly suppliedClassName;
    alt = 'Image description here';
    className = '';
    src: SafeResourceUrl;
    loading = false;
    progress = 0;
    progressText = 'loading';

    constructor(private sanitizer: DomSanitizer) {
        this.className = this.className || this.defaultClassName;
        this.suppliedClassName = this.className;
    }

    ngOnInit() {
        this.initXHR();
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
        console.log(self.dataSrc);
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
        this.className += ' loading';
    }

    onProgress (e) {
        if (e.lengthComputable) {
            const expectedProgress = e.loaded / e.total,
                progress = isNumber(expectedProgress) ? expectedProgress : 0;
            this.progressText = Math.round((progress * 100)) + '%';
        }
    }

    onLoad () {
        this.src = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(this.xhr.response));
        this.loading = false;
        this.className = this.suppliedClassName;
    }

    onLoadEnd () {
        this.progressText = 'Load ended';
    }

    onAbort () {
        this.progressText = 'Image loading aborted.';
    }

    onError () {
        this.progressText = 'Unable to load image.';
    }

}
