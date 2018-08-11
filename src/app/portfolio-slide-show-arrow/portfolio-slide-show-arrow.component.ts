import {Component, Input, OnInit} from '@angular/core';

export enum ArrowDirection {
    Left = 'left',
    Right = 'right'
}

@Component({
  selector: 'app-portfolio-slide-show-arrow',
  templateUrl: './portfolio-slide-show-arrow.component.html',
  styleUrls: ['./portfolio-slide-show-arrow.component.scss']
})
export class PortfolioSlideShowArrowComponent implements OnInit {
    @Input('direction') direction: ArrowDirection = ArrowDirection.Left;
  constructor() { }

  ngOnInit() {
  }

  arrowPointsLeft () {
      return this.direction === ArrowDirection.Left;
  }

  arrowPointsRight () {
      return this.direction === ArrowDirection.Right;
  }

}
