import { TestBed } from '@angular/core/testing';

import { AlertService } from './alert-service.service';

describe('AlertServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlertService = TestBed.get(AlertServiceService);
    expect(service).toBeTruthy();
  });
});
