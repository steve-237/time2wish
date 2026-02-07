import { Component, ElementRef, inject, OnInit, ViewChild, signal, computed } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

// Services & Models
import { TranslocoService } from '@jsverse/transloco';
import { AuthService } from '../../core/services/auth/auth.service';
import { UserProfile } from '../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profil',
  standalone: true,
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
    MatTooltipModule,
    TranslocoModule
  ],
  templateUrl: './profil.component.html',
})
export class ProfilComponent implements OnInit {
  // Functional Injection
  private readonly fb = inject(FormBuilder);
  protected readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);
  public readonly dialogRef = inject(MatDialogRef<ProfilComponent>);

  // Local State Management with Signals
  readonly editMode = signal(false);
  readonly isLoading = signal(false);
  
  // Temporal image signal for preview during edit
  private readonly _previewImage = signal<string | ArrayBuffer | null>(null);

  // Computed signal: prioritizes preview if editing, otherwise uses service data
  readonly profileImage = computed(() => 
    this._previewImage() ?? this.authService.currentUser()?.profilePicture ?? null
  );

  readonly profileForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: [{ value: '', disabled: true }], // Email is usually non-editable
    bio: [''],
    notificationsEnabled: [true],
    language: ['fr'],
    theme: ['light'],
  });

  private originalFormValues!: Partial<UserProfile>;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.populateForm(user);
    }
  }

  private populateForm(user: UserProfile): void {
    this.profileForm.patchValue({
      fullName: user.fullName,
      email: user.email,
      bio: user.bio || '',
      notificationsEnabled: user.notificationsEnabled ?? true,
      language: user.language || 'fr',
      theme: user.theme || 'light',
    });
    this.originalFormValues = this.profileForm.getRawValue();
  }

  toggleEditMode(): void {
    this.editMode.update(val => !val);
    if (!this.editMode()) {
      this.cancelEdit();
    }
  }

  cancelEdit(): void {
    this.profileForm.patchValue(this.originalFormValues);
    this._previewImage.set(null);
    this.editMode.set(false);
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      this.showSnackBar('errors.image_too_large', 'error-snackbar');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => this._previewImage.set(reader.result);
    reader.readAsDataURL(file);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
  
    this.isLoading.set(true);
    const user = this.authService.currentUser();
    
    // 1. Déclaration de l'objet (ici il est "utilisé" par l'appel ci-dessous)
    const updatedProfile: Partial<UserProfile> = {
      ...this.profileForm.getRawValue(),
      profilePicture: (this._previewImage() as string) ?? user?.profilePicture
    };
  
    // 2. Utilisation effective de la variable
    this.authService.updateUserProfile(user!.id, updatedProfile).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.editMode.set(false);
        this._previewImage.set(null); // Reset preview after success
        
        this.snackBar.open(
          this.transloco.translate('profile.update_success'), 
          'OK', 
          { duration: 3000 }
        );
  
        // On met à jour les valeurs de référence pour le prochain "Annuler"
        this.originalFormValues = this.profileForm.getRawValue();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.snackBar.open(err.error?.message || 'Error', 'OK', { duration: 5000 });
      }
    });
  }

  private showSnackBar(messageKey: string, panelClass: string): void {
    this.snackBar.open(this.transloco.translate(messageKey), 'OK', {
      duration: 3000,
      panelClass: [panelClass],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  onDeleteAccount(): void {console.log('onDeleteAccount');}
}