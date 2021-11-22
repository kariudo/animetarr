import { TestBed } from '@angular/core/testing';

import { AnimetarrService } from './animetarr.service';

describe('AnimetarrService', () => {
  let service: AnimetarrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimetarrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
