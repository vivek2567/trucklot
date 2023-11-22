import { Injectable } from '@angular/core';
import { APIService } from 'src/app/shared';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { Observable, map } from 'rxjs';

@Injectable()
export class LoginService {

  constructor(private apiService: APIService) { }

  loginUser(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('User/Login', loginRequest);
  };
}
