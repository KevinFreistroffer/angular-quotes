import { TestBed } from '@angular/core/testing';

import { ChuckNorrisService } from './chuck-norris.service';

describe('ChuckNorrisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChuckNorrisService = TestBed.get(ChuckNorrisService);
    expect(service).toBeTruthy();
  });
});
