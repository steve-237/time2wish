import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginComponent } from './pages/login/login.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { PasswordResetComponent } from './pages/password-reset/password-reset.component';

export const routes: Routes = [
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/page-not-found' },
];
