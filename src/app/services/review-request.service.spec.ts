import { TestBed } from '@angular/core/testing';

import { ReviewRequestService } from './review-request.service';

describe('ReviewRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReviewRequestService = TestBed.get(ReviewRequestService);
    expect(service).toBeTruthy();
  });
});
