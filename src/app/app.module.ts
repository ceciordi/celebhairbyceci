import {BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {PortfolioComponent} from './portfolio/portfolio.component';
import {PortfolioSlideShowComponent} from './portfolio-slide-show/portfolio-slide-show.component';
import {PortfolioThumbsComponent} from './portfolio-thumbs/portfolio-thumbs.component';
import { ImageWithLoaderComponent } from './image-with-loader/image-with-loader.component';
import {PortfolioSlideShowArrowComponent} from './portfolio-slide-show-arrow/portfolio-slide-show-arrow.component';
import { BgOverlayComponent } from './bg-overlay/bg-overlay.component';
import { PortfolioThumbComponent } from './portfolio-thumb/portfolio-thumb.component';

@NgModule({
  declarations: [
    AppComponent,
    PortfolioComponent,
    PortfolioSlideShowComponent,
    PortfolioThumbsComponent,
    ImageWithLoaderComponent,
    PortfolioSlideShowArrowComponent,
    BgOverlayComponent,
    PortfolioThumbComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
