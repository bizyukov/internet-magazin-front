import { TestBed } from '@angular/core/testing';

import { Manufacturer } from './manufacturer';

describe('Manufacturer', () => {
  let service: Manufacturer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Manufacturer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
