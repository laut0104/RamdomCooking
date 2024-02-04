import { TestBed } from '@angular/core/testing';

import { LikeRepoService } from './like-repo.service';

describe('LikeRepoService', () => {
  let service: LikeRepoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LikeRepoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
