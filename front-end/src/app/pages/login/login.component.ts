import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  hidePassword = true;
  isLoading = false;
  errorMessage = '';
  private loginSub: Subscription | null = null;

  router = inject(Router);

  constructor(
    private dialog: DialogService,
    private authService: AuthService
  ) {}

  onLogin(email: string, password: string) {
    this.isLoading = true;
    this.errorMessage = '';

    this.loginSub = this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/landing-page']);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err;
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
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
