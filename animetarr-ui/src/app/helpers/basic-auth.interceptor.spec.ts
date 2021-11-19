import { TestBed } from '@angular/core/testing';

import { BasicAuthInterceptor } from './basic-auth.interceptor';

describe('BasicAuthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      BasicAuthInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: BasicAuthInterceptor = TestBed.inject(BasicAuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
