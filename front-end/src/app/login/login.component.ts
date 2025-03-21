import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  showPassword = false;

  router = inject(Router);

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    this.router.navigate(["/landing-page"]);
  }
}
