import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { PasswordResetComponent } from '../password-reset/password-reset.component';
import { RegistrationComponent } from '../registration/registration.component';
import { DialogService } from '../../shared/services/dialog/dialog.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  hidePassword = true;

  router = inject(Router);

  constructor(private dialog: DialogService) {}

  onLogin() {
    this.router.navigate(['/landing-page']);
  }

  openPasswordReset() {
    this.dialog.open(PasswordResetComponent);
  }

  openRegister() {
    this.dialog.open(RegistrationComponent);
  }
}
