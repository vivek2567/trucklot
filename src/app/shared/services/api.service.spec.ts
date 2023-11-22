import { TestBed } from '@angular/core/testing';

import { APIService } from './api.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { of } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { AuthService } from 'src/app/core';

describe('APIService', () => {
  let service: APIService;
  let authService: AuthService;
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'put']);
  const mockApiResponse: ApiResponse<any> = {
    message: 'success',
    status: true,
    data: {
      name: "test"
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [APIService, HttpHandler,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(APIService);
    authService = TestBed.inject(AuthService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should check post method', () => {
    spyOn(authService, 'getToken').and.returnValue('token');
    httpClientSpy.post.and.returnValue(of(mockApiResponse));
    service.post('testurl').subscribe((res: any) => {
      expect(res.name).toBe('test');
    })

  });

  it('should check postWithAllResponse method', () => {
    spyOn(authService, 'getToken').and.returnValue('token');
    httpClientSpy.post.and.returnValue(of(mockApiResponse));
    service.postWithAllResponse('testurl').subscribe((res: any) => {
      expect(res.data.name).toBe('test');
    })

  });

  it('should check get method', () => {
    spyOn(authService, 'getToken').and.returnValue('token');
    httpClientSpy.get.and.returnValue(of(mockApiResponse));
    service.get('testurl').subscribe((res: any) => {
      expect(res.name).toBe('test');
    })

  });
  it('should check getWithAllResponse method', () => {
    spyOn(authService, 'getToken').and.returnValue('token');
    httpClientSpy.get.and.returnValue(of(mockApiResponse));
    service.getWithAllResponse('testurl').subscribe((res: any) => {
      expect(res.data.name).toBe('test');
    })

  });

  it('should check put method', () => {
    spyOn(authService, 'getToken').and.returnValue('token');
    httpClientSpy.put.and.returnValue(of(mockApiResponse));
    service.put('testurl').subscribe((res: any) => {
      expect(res.name).toBe('test');
    })

  });

});
