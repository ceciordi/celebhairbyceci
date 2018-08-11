import { TestBed, inject } from '@angular/core/testing';

import { ScreenMetaService } from './screen-meta.service';

describe('ScreenMetaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScreenMetaService]
    });
  });

  it('should be created', inject([ScreenMetaService], (service: ScreenMetaService) => {
    expect(service).toBeTruthy();
  }));
});
