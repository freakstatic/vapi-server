import {inject, TestBed} from '@angular/core/testing';

import {AuthLoginGuard} from './auth.login.guard';

describe('AuthLoginGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthLoginGuard]
    });
  });

  it('should ...', inject([AuthLoginGuard], (guard: AuthLoginGuard) => {
    expect(guard).toBeTruthy();
  }));
});
