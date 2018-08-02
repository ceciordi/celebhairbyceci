import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioThumbsComponent } from '../portfolio-thumbs/portfolio-thumbs.component';
import { PortfolioSlideShowComponent } from '../portfolio-slide-show/portfolio-slide-show.component';
import { PortfolioSlideComponent } from '../portfolio-slide/portfolio-slide.component';
import { PortfolioThumbComponent } from '../portfolio-thumb/portfolio-thumb.component';
import { PortfolioComponent } from './portfolio.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PortfolioThumbsComponent, PortfolioSlideShowComponent, PortfolioSlideComponent, PortfolioThumbComponent, PortfolioComponent]
})
export class PortfolioModule { }
