import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../../core/services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './password-reset.component.html',
})
export class PasswordResetComponent {
  // Use inject() function instead of constructor injection for better type safety and cleaner code
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  // Signals for fine-grained reactivity and optimized change detection
  readonly resetSent = signal(false);
  readonly isLoading = signal(false);

  // Strictly typed form group using nonNullable to prevent values from becoming 'null' on reset
  readonly resetForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  /**
   * Handles the form submission to request a password reset link
   */
  onSubmit(): void {
    // Validate form and ensure no request is already in flight
    if (this.resetForm.invalid || this.isLoading()) {
      return;
    }

    // Extract the email value from the form
    const email = this.resetForm.getRawValue().email;
    
    // Set loading state to true using signal .set()
    this.isLoading.set(true);

    this.authService.requestPasswordReset(email).subscribe({
      next: () => {
        // Handle successful request
        this.resetSent.set(true);
        this.isLoading.set(false);
        this.resetForm.disable(); // Freeze the form after a successful request
      },
      error: (err: HttpErrorResponse) => {
        // Handle server errors or unreachable network
        console.error('Password reset request failed:', err);
        this.isLoading.set(false);
        // Tip: You could add a signal 'errorMessage' here to show feedback in the UI
      }
    });
  }
}