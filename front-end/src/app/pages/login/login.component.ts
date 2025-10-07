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
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy {
  hidePassword = true;
  isLoading = false;
  errorMessage = '';
  private loginSub: Subscription | null = null;

  router = inject(Router);

  // Fake users pour faciliter les tests
  fakeUsers = [
    {
      email: 'jean.dupont@email.com',
      password: 'JD123456',
      name: 'Jean Dupont',
    },
    {
      email: 'sophie.lambert@email.com',
      password: 'SL789012',
      name: 'Sophie Lambert',
    },
  ];

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

    const loginData = { email: email, password: password };

    this.loginSub = this.authService.login(loginData).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.success) {
          // Afficher un message de bienvenue
          this.snackBar.open(
            `Bienvenue ${response.data?.user.fullName} !`,
            'Fermer',
            { duration: 3000 }
          );

          // Rediriger vers la page des anniversaires
          this.router.navigate(['/landing-page']);
        } else {
          this.errorMessage =
            response.message || 'login.errors.invalid_credentials';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login error:', err);

        // Gestion des erreurs HTTP
        if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else if (err.message) {
          this.errorMessage = err.message;
        } else {
          this.errorMessage = 'login.errors.generic';
        }
      },
    });
  }

  ngOnDestroy() {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }

  openPasswordReset() {
    this.dialog.open(PasswordResetComponent);
  }

  openRegister() {
    this.dialog.open(RegistrationComponent);
  }
}
