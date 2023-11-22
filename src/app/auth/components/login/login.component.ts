import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { EMAIL_VALIDATION_PATTERN, LoaderService } from 'src/app/shared';
import { finalize } from 'rxjs';
import { ProfileService } from 'src/app/manager';
import { LoginService } from '../../services/login.service';
import { LoginRequest } from '../../models/login-request.model';
import { LoginResponse } from '../../models/login-response.model';
import { AuthService } from 'src/app/core';
import { Utility } from 'src/app/shared';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;


  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router, private loginService: LoginService, private cookieService: CookieService, private messageService: MessageService, private loaderService: LoaderService) {

  }

  ngOnInit(): void {
    this.loaderService.hideLoader();
    const rememberedUser = this.cookieService.get('rememberedUser');
    const email = this.cookieService.get('rememberedUsername');
    const password = this.cookieService.get('rememberedPassword');

    this.loginForm = this.fb.group({
      email: [rememberedUser ? email : "", [Validators.required, Validators.pattern(EMAIL_VALIDATION_PATTERN)]],
      password: [rememberedUser ? password : "", [Validators.required]],
      rememberMe: [rememberedUser ? true : false]
    })


  }

  login(): void {
    if (this.loginForm.valid) {
      this.loaderService.showLoader();
      const apiRequest: LoginRequest = Object.assign({}, this.loginForm.value);

      this.loginService.loginUser(apiRequest)
        .pipe(
          finalize(() => { this.loaderService.hideLoader() })
        )
        .subscribe({
          next: (loginResponse: LoginResponse) => {
            if (loginResponse.token != null) {
              this.authService.setToken(loginResponse.token);
              this.authService.setUserId(loginResponse.id);
              const profileData: any = { name: loginResponse.name, img: loginResponse.profileImagePath };
              this.profileService.setProfileData(profileData);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login Successful' });
              this.router.navigateByUrl('manager/dashboard');
            }
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Email or Password doesn't match!" });
            }
            else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Email or Password doesn't match!" });
            }
          }
        })

      if (this.loginForm.value.rememberMe) {
        this.cookieService.set('rememberedUser', this.loginForm.value.rememberMe, 30, null, null, true);
        this.cookieService.set('rememberedUsername', this.loginForm.value.email, 30, null, null, true);
        this.cookieService.set('rememberedPassword', this.loginForm.value.password, 30, null, null, true);
      }
      else {
        this.cookieService.delete('rememberedUser');
        this.cookieService.delete('rememberedUsername');
        this.cookieService.delete('rememberedPassword');
      }
    }
    else {
      Utility.markFormGroupTouched(this.loginForm);
    }

  }
}
