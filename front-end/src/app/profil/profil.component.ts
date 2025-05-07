import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-profil',
  imports: [
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {

  profileForm: FormGroup;
  profileImage: string | ArrayBuffer | null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProfilComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.profileImage = '';
    this.profileForm = this.fb.group({
      name: ['this.data?.name', Validators.required],
      email: ['this.data?.email', [Validators.required, Validators.email]],
      notifications: ['this.data?.notifications'],
      bio: ['this.data?.bio']
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.profileImage = reader.result;
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      this.dialogRef.close({
        ...this.profileForm.value,
        photo: this.profileImage
      });
    }
  }

}
