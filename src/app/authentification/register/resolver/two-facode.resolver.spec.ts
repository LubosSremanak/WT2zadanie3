import {TestBed} from '@angular/core/testing';

import {TwoFACodeResolver} from './two-facode.resolver';

describe('TwoFACodeResolver', () => {
  let resolver: TwoFACodeResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TwoFACodeResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
