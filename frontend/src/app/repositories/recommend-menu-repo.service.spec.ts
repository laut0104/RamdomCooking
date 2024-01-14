import { TestBed } from '@angular/core/testing';

import { RecommendMenuRepoService } from './recommend-menu-repo.service';

describe('RecommendMenuRepoService', () => {
  let service: RecommendMenuRepoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecommendMenuRepoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
