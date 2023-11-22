import { TestBed } from '@angular/core/testing';

import { LandingService } from './landing.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { APIService } from './api.service';

describe('LandingService', () => {
  let service: LandingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LandingService, HttpClient, HttpHandler, APIService]
    });
    service = TestBed.inject(LandingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
