import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { APIService } from 'src/app/shared/services/api.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClient, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/core';
import { LoaderService } from 'src/app/shared';
import { LoginResponse } from '../../models/login-response.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: LoginService;
  let authService: AuthService;
  let router: Router;
  let messageService: MessageService;
  let cookieService: CookieService;
  let loaderService: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [SharedModule],
      providers: [LoginService, APIService, HttpClient, HttpHandler]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginService = TestBed.inject(LoginService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    messageService = TestBed.inject(MessageService);
    cookieService = TestBed.inject(CookieService);
    loaderService = TestBed.inject(LoaderService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should log in successfully when the form is valid ', () => {
    // Arrange
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password',
      rememberMe: false,
    });
    const response: LoginResponse = {
      id: 'GFT-RTH-THI',
      email: 'test@mail.com',
      name: 'test user',
      token: 'token',
      roleId: '3434',
      roleName: 'test',
      profileImagePath: 'sdasds.jpg'
    }
    spyOn(loginService, 'loginUser').and.returnValue(of(response));
    spyOn(messageService, 'add');
    spyOn(router, 'navigateByUrl');
    spyOn(loaderService, 'showLoader');
    spyOn(loaderService, 'hideLoader');

    // Act
    component.login();

    // Assert
    expect(loaderService.showLoader).toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Success', detail: 'Login Successful' });
    expect(router.navigateByUrl).toHaveBeenCalledWith('manager/dashboard');
    expect(loaderService.hideLoader).toHaveBeenCalled();
  });

  it('should handle a login error when the form is valid', () => {
    // Arrange
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password',
      rememberMe: false,
    });

    const errorResponse = new HttpErrorResponse({ status: 400, statusText: 'Bad Request' });
    spyOn(loginService, 'loginUser').and.returnValue(throwError(() => errorResponse));
    spyOn(messageService, 'add');
    spyOn(loaderService, 'showLoader');
    spyOn(loaderService, 'hideLoader');

    // Act
    component.login();

    // Assert
    expect(loaderService.showLoader).toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'error', summary: 'Error', detail: "Email or Password doesn't match!" });
    expect(loaderService.hideLoader).toHaveBeenCalled();
  });

});
