import {Component, OnInit} from '@angular/core';
import {PortfolioServiceService} from '../portfolio-service.service';
import {log} from 'fjl';

@Component({
    selector: 'app-portfolio-thumbs',
    templateUrl: './portfolio-thumbs.component.html',
    styleUrls: ['./portfolio-thumbs.component.scss']
})
export class PortfolioThumbsComponent implements OnInit {

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
            elm = e.currentTarget;
        if (elm.classList.contains(activeClassName)) {
            return;
        }
        Array.from(elm.parentElement.childNodes) // move childnodes to component level
            .forEach(x => {
                if (x instanceof HTMLElement) {
                    x.classList.remove(activeClassName)
                }
            });
        elm.classList.add(activeClassName);
        console.log('Thumb clicked', $item);
    }

}
