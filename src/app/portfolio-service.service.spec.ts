import { TestBed, inject } from '@angular/core/testing';

import { PortfolioServiceService } from './portfolio-service.service';

describe('PortfolioServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PortfolioServiceService]
    });
  });

  it('should be created', inject([PortfolioServiceService], (service: PortfolioServiceService) => {
    expect(service).toBeTruthy();
  }));
});
