import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioSlideShowArrowComponent } from './portfolio-slide-show-arrow.component';

describe('PortfolioSlideShowArrowComponent', () => {
  let component: PortfolioSlideShowArrowComponent;
  let fixture: ComponentFixture<PortfolioSlideShowArrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioSlideShowArrowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioSlideShowArrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
