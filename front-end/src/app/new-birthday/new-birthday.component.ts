import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatDialogRef } from '@angular/material/dialog';
import {provideNativeDateAdapter} from '@angular/material/core';

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
    MatDividerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './new-birthday.component.html',
  styleUrl: './new-birthday.component.css'
})
export class NewBirthdayComponent {

  profileForm: FormGroup;
  profileImage: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      birthdate: ['', Validators.required],
      relation: ['friend', Validators.required],
      email: [''],
      phone: [''],
      notes: [''],
      enableReminders: [true]
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
      console.log('Profile data:', this.profileForm.value);
      // Ici vous ajouteriez la logique pour sauvegarder les données
    }
  }
}
