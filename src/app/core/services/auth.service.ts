import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  getToken(): string {
    const token = localStorage.getItem('token');
    return token ? token : "";
  }
  setToken(token: string): void {
    localStorage.setItem('token', token);

  }
  setUserId(userId: string): void {
    localStorage.setItem('id', userId);

  }
  getUserId(): string {
    const userId = localStorage.getItem('id');
    return userId ? userId : "";

  }
  isLoggesIn(): boolean {
    const token = this.getToken();
    if (token == 'Invalid' || token == '' || token == null || token == undefined) {
      return false;
    } else {
      return true;
    }
  }
}
