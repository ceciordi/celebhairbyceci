import {BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {PortfolioComponent} from './portfolio/portfolio.component';
import {PortfolioSlideComponent} from './portfolio-slide/portfolio-slide.component';
import {PortfolioSlideShowComponent} from './portfolio-slide-show/portfolio-slide-show.component';
import {PortfolioThumbComponent} from './portfolio-thumb/portfolio-thumb.component';
import {PortfolioThumbsComponent} from './portfolio-thumbs/portfolio-thumbs.component';
import { ImageWithLoaderComponent } from './image-with-loader/image-with-loader.component';

@NgModule({
  declarations: [
    AppComponent,
    PortfolioComponent,
    PortfolioSlideComponent,
    PortfolioSlideShowComponent,
    PortfolioThumbComponent,
    PortfolioThumbsComponent,
    ImageWithLoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
