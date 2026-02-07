import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoModule } from '@jsverse/transloco';
import { HttpErrorResponse } from '@angular/common/http';

import { PasswordResetComponent } from '../password-reset/password-reset.component';
import { RegistrationComponent } from '../registration/registration.component';
import { DialogService } from '../../shared/services/dialog/dialog.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { SetLanguageComponent } from '../../components/set-language/set-language.component';
import { LoginRequest } from '../../models/loginRequest.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslocoModule,
    SetLanguageComponent,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  // Services injection using the modern inject() function
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly dialog = inject(DialogService);
  private readonly snackBar = inject(MatSnackBar);

  // State management using Signals (replaces plain variables)
  readonly hidePassword = signal(true);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  /**
   * Toggles password visibility in the input field
   */
  togglePasswordVisibility(): void {
    this.hidePassword.update((val) => !val);
  }

  /**
   * Handles the login logic
   * Note: No need for manual Subscription/OnDestroy thanks to signal integration 
   * and clean handling of the AuthService session.
   */
  onLogin(email: string, password: string): void {
    if (!email || !password) {
      this.errorMessage.set('login.errors.required');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const loginData: LoginRequest = { email, password };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.isLoading.set(false);

        if (response?.success && response.data) {
          this.snackBar.open(
            `Bienvenue ${response.data.user.fullName} !`,
            'Fermer',
            { duration: 3000 }
          );
          this.router.navigate(['/']);
        } else {
          this.errorMessage.set(response?.message || 'login.errors.invalid_credentials');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        console.error('Login error:', err);
        
        // Extract server error message or use generic translation key
        const serverMsg = err.error?.message || err.message;
        this.errorMessage.set(serverMsg || 'login.errors.generic');
      },
    });
  }

  openPasswordReset(): void {
    this.dialog.open(PasswordResetComponent);
  }

  openRegister(): void {
    this.dialog.open(RegistrationComponent);
  }
}