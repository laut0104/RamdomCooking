import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { MenuRepoService } from './menu-repo.service';

describe('MenuRepoService', () => {
  let service: MenuRepoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuRepoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
