import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from '../../core/services/auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserProfile } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profil',
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTooltip,
    TranslocoPipe,
  ],
  templateUrl: './profil.component.html',
})
export class ProfilComponent implements OnInit {
  editMode = false;
  profileForm: FormGroup;
  profileImage: string | ArrayBuffer | null = null;
  originalFormValues: any;
  isLoading = true;
  currentUser: UserProfile | null = null;
  userId: string = '';

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProfilComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      bio: [''],
      notificationsEnabled: [true],
      language: ['fr'],
      theme: ['light'],
    });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.userId = this.currentUser ? this.currentUser.id : '';
    console.log('Current User ID: ', this.userId);
  }

  loadUserData() {
    this.isLoading = true;

    // Récupération de l'utilisateur courant via le service
    this.currentUser = this.authService.getCurrentUserValue();

    if (this.currentUser) {
      this.profileImage = this.currentUser.profilePicture || null;

      this.profileForm.patchValue({
        fullName: this.currentUser.fullName,
        email: this.currentUser.email,
        bio: this.currentUser.bio || '',
        notificationsEnabled: this.currentUser.notificationsEnabled ?? true,
        language: this.currentUser.language || 'fr',
        theme: this.currentUser.theme || 'light',
      });

      // Sauvegarder les valeurs originales
      this.originalFormValues = { ...this.profileForm.value };
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
    if (this.originalFormValues) {
      this.profileForm.patchValue(this.originalFormValues);
    }
    this.editMode = false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Vérification du type de fichier
      if (!file.type.match('image.*')) {
        this.snackBar.open('Veuillez sélectionner une image', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        return;
      }

      // Vérification de la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open("L'image ne doit pas dépasser 5MB", 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  removeProfileImage(): void {
    this.profileImage = null;
  }

  saveProfile() {
    if (this.profileForm.valid && this.currentUser) {
      this.isLoading = true;

      const formData = this.profileForm.value;
      const updatedProfile: Partial<UserProfile> = {
        fullName: formData.fullName,
        email: formData.email,
        bio: formData.bio,
        notificationsEnabled: formData.notificationsEnabled,
        language: formData.language,
        theme: formData.theme,
        profilePicture: this.profileImage as string,
      };

      // Appel du service pour mettre à jour le profil
      this.authService
        .updateUserProfile(this.userId, updatedProfile)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            const updatedData = response.data || response;

            if (response) {
              this.snackBar.open('Profil mis à jour avec succès', 'Fermer', {
                duration: 3000,
                panelClass: ['success-snackbar'],
              });
              
              this.authService.setCurrentUser(updatedData as UserProfile);

              this.originalFormValues = { ...this.profileForm.value };
              this.currentUser = updatedData as UserProfile;
              this.editMode = false;
            } else {
              this.snackBar.open(
                response || 'Erreur lors de la mise à jour',
                'Fermer',
                {
                  duration: 5000,
                  panelClass: ['error-snackbar'],
                }
              );
            }
          },
          error: (error) => {
            this.isLoading = false;
            const errorMessage =
              error.error?.message ||
              error.message ||
              'Erreur lors de la mise à jour du profil';
            this.snackBar.open(errorMessage, 'Fermer', {
              duration: 5000,
              panelClass: ['error-snackbar'],
            });
          },
        });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.markFormGroupTouched(this.profileForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // Getters pour accéder facilement aux contrôles du formulaire
  get fullName() {
    return this.profileForm.get('fullName');
  }
  get email() {
    return this.profileForm.get('email');
  }
  get bio() {
    return this.profileForm.get('bio');
  }

  deleteAccount() {
    throw new Error('Method not implemented.');
  }
}
