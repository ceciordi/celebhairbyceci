import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BgOverlayComponent } from './bg-overlay.component';

describe('BgOverlayComponent', () => {
  let component: BgOverlayComponent;
  let fixture: ComponentFixture<BgOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BgOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BgOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
