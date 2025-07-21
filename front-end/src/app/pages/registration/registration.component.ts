import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  hidePassword = true;
  previewImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<RegistrationComponent>
  ) {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('email', this.registrationForm.value.email);
    formData.append('password', this.registrationForm.value.password);
    formData.append('name', this.registrationForm.value.name);
    
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open('Registration successful!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close(); 
        this.router.navigate(['/landing-page']);
      },
      error: (error) => {
        this.isLoading = false;
        let errorMessage = 'An error occurred during registration';
        if (error.error?.message) {
          errorMessage = error.error.message;
        }
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}