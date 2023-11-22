import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/core';
import { environment } from 'src/environment/environment';
import { ApiResponse } from '../models/api-response.model';

const baseURL = environment.endpoint;

@Injectable()
export class APIService {

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  private setHeaders(headers: any = {}): HttpHeaders {
    headers['Accept'] = 'application/json';
    if (this.authService.getToken()) {
      headers['Authorization'] = `Bearer ${this.authService.getToken()}`;
    }
    return new HttpHeaders(headers);
  }


  post<T>(path: string, body: Object = {}, headers: Object = {}): Observable<T> {
    return this.httpClient.post<ApiResponse<T>>(
      `${baseURL}${path}`,
      body,
      { headers: this.setHeaders(headers) }
    )
      .pipe(
        map(response => {
          return response.data;
        }));
  }
  postWithAllResponse<T>(path: string, body: Object = {}, headers: Object = {}): Observable<ApiResponse<T>> {
    return this.httpClient.post<ApiResponse<T>>(
      `${baseURL}${path}`,
      body,
      { headers: this.setHeaders(headers) }
    );
  }
  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.httpClient.get<ApiResponse<T>>(`${baseURL}${path}`, { headers: this.setHeaders({}), params })
      .pipe(
        map(response => {
          return response.data;
        }));
  }
  getWithAllResponse<T>(path: string, params: HttpParams = new HttpParams()): Observable<ApiResponse<T>> {
    return this.httpClient.get<ApiResponse<T>>(`${baseURL}${path}`, { headers: this.setHeaders({}), params });
  }
  put<T>(path: string, body: Object = {}, params: HttpParams = new HttpParams()): Observable<T> {
    return this.httpClient.put<ApiResponse<T>>(`${baseURL}${path}`, body, { headers: this.setHeaders({}), params })
      .pipe(
        map(response => {
          return response.data;
        }));
  }
}

