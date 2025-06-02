import { TestBed } from '@angular/core/testing';

import { QbServiceService } from './qb-service.service';

describe('QbServiceService', () => {
  let service: QbServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
