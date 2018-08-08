import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {error} from 'fjl';
import {catchError, tap} from 'rxjs/operators';

const

    separateImagesByWidths = (imagesList, widths) =>
        widths.reduce((agg, w) => {
            agg[w] = imagesList.filter(item => Math.round(item.width) === w);
            return agg;
        }, {})
;

@Injectable({
    providedIn: 'root'
})
export class PortfolioServiceService {
    private imagesList: object[];
    private imagesBySizes: object = {};
    private fetchImagesIo: Promise<object>;
    endpointUrl = '/assets/json/portfolios-data.json';
    sizes = [55, 89, 233, 377, 610, 987];

    constructor() {}

    fetchImages () {
        if (this.fetchImagesIo) {
            return this.fetchImagesIo;
        }
        return this.fetchImagesIo = fetch(this.endpointUrl)
            .then(res => res.json())
            .then(portfolios => {
                this.imagesList = portfolios;
                this.imagesBySizes = separateImagesByWidths(portfolios[0].files, this.sizes);
                return this.imagesBySizes;
            })
            .catch(error);
    }

}
