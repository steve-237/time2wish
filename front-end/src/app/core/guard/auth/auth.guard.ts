import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

/**
 * Functional Guard to protect private routes.
 * It uses the AuthService signals to check the current authentication state.
 */
export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Check authentication status using the signal from AuthService
  // Since isAuthenticated is a computed signal, this check is high-performance
  if (authService.isAuthenticated()) {
    return true;
  }

  // 2. Access denied logic
  console.warn('Access denied. Redirecting to login page.');
  
  // We return a UrlTree to handle the redirection directly within the router flow
  // We can also append the 'returnUrl' to redirect back after a successful login
  return router.createUrlTree(['/login'], { 
    queryParams: { returnUrl: state.url } 
  });
};