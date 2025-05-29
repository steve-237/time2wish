import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from '../../core/services/auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';

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
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTooltip
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent{

  editMode = false;
  profileForm: FormGroup;
  profileImage: string | ArrayBuffer | null;
  originalFormValues: any;
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProfilComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService
  ) {
    this.profileImage = null;
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      notifications: [true],
      bio: ['']
    });

    setTimeout(() => {
      this.loadUserData();
    }, 1000);
  }

  loadUserData() {
    this.isLoading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      this.profileImage = currentUser.photo || null;
      this.profileForm.patchValue({
        name: currentUser.name,
        email: currentUser.email,
        bio: currentUser.bio || '',
        notifications: currentUser.notifications ?? true
      });
      
      // Sauvegarder les valeurs originales
      this.originalFormValues = this.profileForm.value;
    }
    
    this.isLoading = false;
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.profileForm.patchValue(this.originalFormValues);
    this.editMode = false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      
      // Simuler une requête API
      setTimeout(() => {
        const updatedProfile = {
          ...this.authService.getCurrentUser(),
          ...this.profileForm.value,
          photo: this.profileImage
        };
        
        this.authService.updatedProfile(updatedProfile);
        this.originalFormValues = this.profileForm.value;
        this.editMode = false;
        this.isLoading = false;
        this.dialogRef.close(updatedProfile);
      }, 1000);
    }
  }

}
