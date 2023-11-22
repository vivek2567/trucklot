import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const router: Router = inject(Router);
  const authGuardService: AuthService = inject(AuthService);
  if (authGuardService.isLoggesIn()) {
    return true;

  } router.navigate(['manager-login'])
  return false;
};
