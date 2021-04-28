import {TestBed} from '@angular/core/testing';

import {LoginReturnGuard} from './login-return.guard';

describe('LoginReturnGuard', () => {
  let guard: LoginReturnGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoginReturnGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
