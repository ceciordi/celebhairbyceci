import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioThumbsComponent } from './portfolio-thumbs.component';

describe('PortfolioThumbsComponent', () => {
  let component: PortfolioThumbsComponent;
  let fixture: ComponentFixture<PortfolioThumbsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioThumbsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioThumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
