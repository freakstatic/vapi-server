import {inject, TestBed} from '@angular/core/testing';

import {CredentialsManagerService} from './credentials.manager.service';

describe('CredentialsManagerService', () =>
{
 beforeEach(() =>
 {
  TestBed.configureTestingModule({
   providers: [CredentialsManagerService]
  });
 });

 it('should be created', inject([CredentialsManagerService], (service: CredentialsManagerService) =>
 {
  expect(service).toBeTruthy();
 }));
});