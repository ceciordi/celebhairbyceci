import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageWithLoaderComponent } from './image-with-loader.component';

describe('ImageWithLoaderComponent', () => {
  let component: ImageWithLoaderComponent;
  let fixture: ComponentFixture<ImageWithLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageWithLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageWithLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
