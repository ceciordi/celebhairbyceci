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
    imagesList: object[] = [];
    imagesBySizes: object = {};
    endpointUrl = '/assets/json/portfolios-data.json';
    sizes = [55, 89, 233, 377, 610, 987];
    constructor(private http: HttpClient) {}
    fetchImages () {
        return this.http.get(this.endpointUrl)
            .pipe(tap(portfolios => {
                console.log(portfolios);
                // this.imagesList = imagesList;
                this.imagesBySizes = separateImagesByWidths(portfolios[0].files, this.sizes);
                return this.imagesBySizes;
            }), catchError(error));
    }

}
