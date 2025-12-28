import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { PasswordResetComponent } from '../password-reset/password-reset.component';
import { RegistrationComponent } from '../registration/registration.component';
import { DialogService } from '../../shared/services/dialog/dialog.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { TranslocoModule } from '@jsverse/transloco';
import { SetLanguageComponent } from '../../components/set-language/set-language.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiResponse } from '../../models/apiResponse.model';
import { AuthResponse } from '../../models/authResponse.model';
import { LoginRequest } from '../../models/loginRequest.model';

@Component({
  selector: 'app-login',
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
export class LoginComponent implements OnDestroy {
  hidePassword = true;
  isLoading = false;
  errorMessage = '';
  private loginSub: Subscription | null = null;

  router = inject(Router);

  constructor(
    private dialog: DialogService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  onLogin(email: string, password: string) {
    if (!email || !password) {
      this.errorMessage = 'login.errors.required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const loginData: LoginRequest = { email, password };

    this.loginSub = this.authService.login(loginData).subscribe({
      next: (response: ApiResponse<AuthResponse>) => {
        this.isLoading = false;

        console.log('Login response:', response);

        if (response?.success && response.data) {
          this.snackBar.open(
            `Bienvenue ${response.data.user.fullName} !`,
            'Fermer',
            { duration: 3000 }
          );

          this.router.navigate(['/landing-page']);
        } else {
          this.errorMessage =
            response?.message || 'login.errors.invalid_credentials';
        }
      },
      error: (err: unknown) => {
        this.isLoading = false;
        console.error('Login error:', err);

        const anyErr = err as { error?: { message?: string }; message?: string };

        if (anyErr.error?.message) {
          this.errorMessage = anyErr.error.message;
        } else if (anyErr.message) {
          this.errorMessage = anyErr.message;
        } else {
          this.errorMessage = 'login.errors.generic';
        }
      },
    });
  }

  ngOnDestroy() {
    this.loginSub?.unsubscribe();
  }

  openPasswordReset() {
    this.dialog.open(PasswordResetComponent);
  }

  openRegister() {
    this.dialog.open(RegistrationComponent);
  }
}
