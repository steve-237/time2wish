import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-password-reset',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    TranslocoModule,
  ],
  templateUrl: './password-reset.component.html',
})
export class PasswordResetComponent {
  resetForm: FormGroup;
  resetSent = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    //TODO: Gérer l'erreur si l'email n'est pas valide
    //TODO: Gérer l'erreur si l'email n'est pas trouvé
    //TODO: Gérer l'erreur si le serveur est injoignable
    //TODO: Gérer le succès de l'envoi du lien de réinitialisation
    if (this.resetForm.valid) {
      console.log('Reset requested for:', this.resetForm.value.email);

      this.authService.requestPasswordReset(this.resetForm.value.email).subscribe({
        next: (res) => {
          // Afficher un message de succès (le lien est envoyé)
          this.resetSent = true;
        },
        error: (err) => {
          // Gérer l'erreur (ex: serveur injoignable)
          console.error(err);
        }
      });
    }
  }
}
