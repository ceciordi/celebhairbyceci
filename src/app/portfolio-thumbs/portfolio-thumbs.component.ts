import {Component, OnInit, QueryList, ViewChildren, ElementRef} from '@angular/core';
import {PortfolioServiceService} from '../portfolio-service.service';
import {log} from 'fjl';

@Component({
    selector: 'app-portfolio-thumbs',
    templateUrl: './portfolio-thumbs.component.html',
    styleUrls: ['./portfolio-thumbs.component.scss']
})
export class PortfolioThumbsComponent implements OnInit {
    @ViewChildren('imageWithLoader', {read: ElementRef}) childNodes: QueryList<ElementRef>;
    items: Array<Object> = [];
    readonly activeClassName = 'active';
    constructor(private portfolioService: PortfolioServiceService) {}

    ngOnInit() {
        this.portfolioService.fetchImages()
            .then(imagesBySize => {
                this.items = imagesBySize[377];
            });
    }

    onThumbClick (e, $item) {
        const {activeClassName, childNodes} = this,
            elm = e.currentTarget.firstChild;
        if (elm.classList.contains(activeClassName)) {
            return;
        }
        childNodes.forEach(x => {
            x.nativeElement.firstChild.classList.remove(activeClassName)
        });
        elm.classList.add(activeClassName);
        console.log('Thumb clicked', $item);
    }

}
