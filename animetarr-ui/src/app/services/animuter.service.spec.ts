import { TestBed } from '@angular/core/testing';

import { AnimuterService } from './animuter.service';

describe('AnimuterService', () => {
  let service: AnimuterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimuterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
