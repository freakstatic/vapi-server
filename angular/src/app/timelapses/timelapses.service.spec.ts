import { TestBed, inject } from '@angular/core/testing';

import { TimelapsesService } from './timelapses.service';

describe('TimelapsesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimelapsesService]
    });
  });

  it('should be created', inject([TimelapsesService], (service: TimelapsesService) => {
    expect(service).toBeTruthy();
  }));
});
