import { Component, OnInit } from '@angular/core';
import {PortfolioServiceService} from '../portfolio-service.service';
import {log} from 'fjl';

@Component({
  selector: 'app-portfolio-thumbs',
  templateUrl: './portfolio-thumbs.component.html',
  styleUrls: ['./portfolio-thumbs.component.scss']
})
export class PortfolioThumbsComponent implements OnInit {
    items: Array<object>;
    readonly activeClassName = 'active';

  constructor(ps: PortfolioServiceService) {
      ps.fetchImages()
          .subscribe(s => {
              this.items = s[0].files.filter(x => x.width === 377);
              // log(this.items);
          });
  }

  ngOnInit() {
  }

}
