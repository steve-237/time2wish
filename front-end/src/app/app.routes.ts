import { Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/landing-page/landing-page.component').then(m => m.LandingPageComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/registration/registration.component').then(m => m.RegistrationComponent) 
  },
  { 
    path: 'password-reset', 
    loadComponent: () => import('./pages/password-reset/password-reset.component').then(m => m.PasswordResetComponent) 
  },
  { 
    path: 'reset-password', 
    loadComponent: () => import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) 
  },
  { 
    path: 'page-not-found', 
    loadComponent: () => import('./pages/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
  },
  { path: '**', redirectTo: '' },
];
