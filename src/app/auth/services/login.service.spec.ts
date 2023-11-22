import { TestBed } from '@angular/core/testing';

import { LoginService } from './login.service';
import { APIService } from 'src/app/shared';
import { HttpClient, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';



describe('LoginService', () => {
  let service: LoginService;
  let apiService: APIService; // Replace with the actual API service


  beforeEach(() => {
    //TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
    TestBed.configureTestingModule({
      providers: [LoginService, HttpClient, HttpHandler, APIService
      ]
    });
    service = TestBed.inject(LoginService);
    apiService = TestBed.inject(APIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in successfully', (done: DoneFn) => {
    const loginRequest: LoginRequest = {
      email: 'test@example.com', password: 'password',
      rememberMe: false
    };
    const response: LoginResponse = {
      id: 'GFT-RTH-THI',
      email: 'test@mail.com',
      name: 'John Doe',
      token: 'mockToken',
      roleId: '3434',
      roleName: 'test',
      profileImagePath: 'profile.jpg'
    }
    spyOn(apiService, 'post').and.returnValue(of(response));
    service.loginUser(loginRequest).subscribe((response: LoginResponse) => {
      // Check for the successful response
      expect(response.token).toBe('mockToken');
      expect(response.name).toBe('John Doe');
      expect(response.profileImagePath).toBe('profile.jpg');
      done(); // Call done to handle asynchronous test
    });
  });

  it('should handle login error', (done: DoneFn) => {
    const loginRequest: LoginRequest = {
      email: 'invalid@example.com', password: 'invalid',
      rememberMe: false
    };
    const errorResponse = new HttpErrorResponse({ status: 400, statusText: 'Bad Request' });
    spyOn(apiService, 'post').and.returnValue(throwError(() => errorResponse));
    service.loginUser(loginRequest)
      .subscribe({
        next: () => {
          // It should not reach here for an error case
          expect(true).toBeFalse(); // Fails the test as it should not be called
          done();
        },
        error: (error) => {
          // Check for the error response
          expect(error).toBeDefined();
          expect(error.statusText).toBe('Bad Request');
          done(); // Call done to handle asynchronous test
        }
      });
  });
});


