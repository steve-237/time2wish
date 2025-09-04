import { Component, Inject } from '@angular/core';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { provideNativeDateAdapter } from '@angular/material/core';
import { BirthdayService } from '../../core/services/birthday/birthday.service';
import { Birthday } from '../../models/birthday.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfettiService } from '../../shared/services/confetti/confetti.service';
import { NotificationService } from '../../shared/services/notification/notification.service';
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
  selector: 'app-new-birthday',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    MatDividerModule,
    TranslocoPipe,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './new-birthday.component.html',
  styleUrl: './new-birthday.component.css',
})
export class NewBirthdayComponent {
  profileForm: FormGroup;
  profileImage: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private birthdayService: BirthdayService,
    private snackBar: MatSnackBar,
    private router: Router,
    private confetti: ConfettiService,
    public dialogRef: MatDialogRef<NewBirthdayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public notificationService: NotificationService
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      birthdate: ['', Validators.required],
      relation: ['friend', Validators.required],
      email: [''],
      phone: [''],
      notes: [''],
      city: [''],
      enableReminders: [true],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;

      const newBirthday: Birthday = {
        id: 0, // sera généré par le service
        name: formValue.fullName,
        date: new Date(formValue.birthdate),
        category: formValue.relation,
        email: formValue.email,
        phone: formValue.phone,
        notes: formValue.notes,
        enableReminders: formValue.enableReminders,
        photo: this.profileImage as string,
        passed: this.isBirthdayPassed(formValue.birthdate),
        city: formValue.city
      };

      this.birthdayService.addBirthday(newBirthday);

      this.snackBar.open('Anniversaire ajouté avec succès', 'Fermer', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });

      this.confetti.fireConfetti();
      this.notificationService.addSuccessNotification("Nouvel anniversaire ajoute avec succes")

      this.router.navigate(['/landing-page']);
      this.dialogRef.close();
    }
  }

  private isBirthdayPassed(birthdate: string): boolean {
    const today = new Date();
    const bDate = new Date(birthdate);
    bDate.setFullYear(today.getFullYear()); // Comparaison sans l'année
    return bDate < today;
  }

  cancel(): void {
    this.router.navigate(['/landing-page']);
    this.dialogRef.close();
  }
}
