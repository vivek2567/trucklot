import { TestBed } from '@angular/core/testing';

import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check show loader is true', () => {
    service.showLoader();
    expect(service.getLoading()).toBeTruthy();
  });
  it('should check show loader false', () => {
    service.hideLoader();
    expect(service.getLoading()).toBeFalsy();
  });
});
