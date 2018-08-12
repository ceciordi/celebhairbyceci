import {Injectable} from '@angular/core';
import {keys, error} from 'fjl';

const

    separateImagesByWidths = (imagesList, widths) =>
        widths.reduce((agg, w) => {
            agg[w] = imagesList.filter(item => Math.round(item.width) === w);
            return agg;
        }, {}),

    addIndicesToImagesByWidths = (imagesByWidths) => // For all keys
        keys(imagesByWidths).reduce((agg, key) => {
            // For each in set add index property
            agg[key].forEach((x, ind) => {
                x.index = ind;
                return x;
            });
            return agg;
        }, imagesByWidths)
;

@Injectable({
    providedIn: 'root'
})
export class PortfolioServiceService {
    private imagesList: object[];
    private imagesBySizes: object = {};
    private fetchImagesIo: Promise<object>;
    endpointUrl = '/assets/json/portfolios-data.json';
    sizes = [55, 89, 233, 377, 610, 987]; // , 1597];

    constructor() {}

    fetchImages () {
        if (this.fetchImagesIo) {
            return this.fetchImagesIo;
        }
        return this.fetchImagesIo = fetch(this.endpointUrl)
            .then(res => res.json())
            .then(portfolios => {
                this.imagesList = portfolios;
                this.imagesBySizes =
                    addIndicesToImagesByWidths(
                        separateImagesByWidths(
                            portfolios[0].files,
                            this.sizes
                        )
                    );
                return this.imagesBySizes;
            })
            .catch(error);
    }

}
