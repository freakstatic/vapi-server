import {inject, TestBed} from '@angular/core/testing';

import {UserListServiceService} from './user-list.service';

describe('UserListServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserListServiceService]
    });
  });

  it('should be created', inject([UserListServiceService], (service: UserListServiceService) => {
    expect(service).toBeTruthy();
  }));
});
