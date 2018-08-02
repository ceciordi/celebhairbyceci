import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioSlideComponent } from './portfolio-slide.component';

describe('PortfolioSlideComponent', () => {
  let component: PortfolioSlideComponent;
  let fixture: ComponentFixture<PortfolioSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
