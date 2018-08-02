import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioSlideShowComponent } from './portfolio-slide-show.component';

describe('PortfolioSlideShowComponent', () => {
  let component: PortfolioSlideShowComponent;
  let fixture: ComponentFixture<PortfolioSlideShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioSlideShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioSlideShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
