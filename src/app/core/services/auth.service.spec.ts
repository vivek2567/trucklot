import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the token from localStorage when it exists', () => {
    const mockToken = 'mockToken';
    spyOn(localStorage, 'getItem').and.returnValue(mockToken);

    const token = service.getToken();

    expect(token).toBe(mockToken);
    expect(localStorage.getItem).toHaveBeenCalledWith('token');
  });

  it('should return an empty string when the token does not exist in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const token = service.getToken();

    expect(token).toBe('');
    expect(localStorage.getItem).toHaveBeenCalledWith('token');
  });
  it('should set the token in localStorage', () => {
    const mockToken = 'mockToken';

    spyOn(localStorage, 'setItem');

    service.setToken(mockToken);

    expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
  });

  it('should return true when a valid token is present', () => {
    spyOn(service, 'getToken').and.returnValue('validToken');

    const isLoggedIn = service.isLoggesIn();

    expect(isLoggedIn).toBeTrue();
  });
  it('should return false when the token is "Invalid"', () => {
    spyOn(service, 'getToken').and.returnValue('Invalid');

    const isLoggedIn = service.isLoggesIn();

    expect(isLoggedIn).toBeFalse();
  });


  it('should return the user id from localStorage when it exists', () => {
    const mockUserId = 'mockUserId';
    spyOn(localStorage, 'getItem').and.returnValue(mockUserId);

    const userId = service.getUserId();

    expect(userId).toBe(mockUserId);
    expect(localStorage.getItem).toHaveBeenCalledWith('id');
  });

  it('should return an empty string when the user id does not exist in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const userId = service.getUserId();

    expect(userId).toBe('');
    expect(localStorage.getItem).toHaveBeenCalledWith('id');
  });

});
