import {BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {PortfolioComponent} from './portfolio/portfolio.component';
import {PortfolioSlideShowComponent} from './portfolio-slide-show/portfolio-slide-show.component';
import {PortfolioThumbsComponent} from './portfolio-thumbs/portfolio-thumbs.component';
import { ImageWithLoaderComponent } from './image-with-loader/image-with-loader.component';
import {PortfolioSlideShowArrowComponent} from './portfolio-slide-show-arrow/portfolio-slide-show-arrow.component';
import { BgOverlayComponent } from './bg-overlay/bg-overlay.component';

@NgModule({
  declarations: [
    AppComponent,
    PortfolioComponent,
    PortfolioSlideShowComponent,
    PortfolioThumbsComponent,
    ImageWithLoaderComponent,
    PortfolioSlideShowArrowComponent,
    BgOverlayComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
