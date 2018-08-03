import {Component, OnInit} from '@angular/core';
import {assign, isNumber} from 'fjl';

@Component({
    selector: 'app-image-with-loader',
    templateUrl: './image-with-loader.component.html',
    styleUrls: ['./image-with-loader.component.scss']
})
export class ImageWithLoaderComponent implements OnInit {
    private src = '';
    private loading = false;
    private xhr = new XMLHttpRequest();
    private progress = 0;
    className = 'image-with-preloader';
    dataSrc = '';
    onClick = e => undefined;

    constructor() {}

    ngOnInit() {
        this.initXHR();
    }

    initXHR () {
        const self = this,
            {xhr} = self;
        xhr.responseType = 'blob';
        xhr.addEventListener('loadstart', self.onLoadStart.bind(self));
        xhr.addEventListener('progress', self.onProgress.bind(self));
        // xhr.addEventListener('loadend', ctx.onLoadEnd);
        xhr.addEventListener('load', self.onLoad.bind(self));
        xhr.addEventListener('error', self.onError.bind(self));
        // xhr.addEventListener('abort', this.onAbort);
    }

    loadSrc (src) {
        this.xhr.abort();
        this.xhr.open('GET', src, true);
        this.loading = true;
        this.progress = 0;
        this.xhr.send();
    }

    onLoadStart (e) {
        // this.refs.progressText.innerHTML = '0%';
        // addClass('loading', this.refs.self);
    }

    onProgress (e) {
        if (e.lengthComputable) {
            const expectedProgress = e.loaded / e.total,
                progress = isNumber(expectedProgress) ? expectedProgress : 0;
            // this.refs.progressText.innerHTML = Math.round((progress * 100)) + '%';
        }
    }

    onLoad () {
        this.src = window.URL.createObjectURL(this.xhr.response);
        this.loading = false;
        // removeClass('loading', this.refs.self);
    }

    // onLoadEnd (e) { }

    onError (e) {
        // this.refs.progressText.innerHTML = 'Unable to load image.';
    }

}
