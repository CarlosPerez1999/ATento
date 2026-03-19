import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');
  
  if (token) {
    return true;
  }
  
  // Navigate to login if not authenticated
  return router.createUrlTree(['/auth/login']);
};
