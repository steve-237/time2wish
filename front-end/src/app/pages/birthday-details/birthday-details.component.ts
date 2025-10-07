import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-birthday-details',
  imports: [
    MatInput,
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    TranslocoPipe,
  ],
  templateUrl: './birthday-details.component.html',
  styleUrl: './birthday-details.component.css',
})
export class BirthdayDetailsComponent {
  newLike = '';

  constructor(
    public dialogRef: MatDialogRef<BirthdayDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private translocoService: TranslocoService
  ) {}

  addLike() {
    if (this.newLike && this.newLike.trim()) {
      if (!this.data.likes) {
        this.data.likes = [];
      }
      this.data.likes.push(this.newLike.trim());
      this.newLike = '';
    }
  }

  removeLike(like: string) {
    this.data.likes = this.data.likes.filter((l: string) => l !== like);
  }

  /**
   * Détermine si l'anniversaire est passé
   */
  isBirthdayPassed(birthdate: Date): boolean {
    const today = new Date();
    const thisYearBirthday = new Date(birthdate);
    thisYearBirthday.setFullYear(today.getFullYear());

    return thisYearBirthday < today;
  }

  /**
   * Retourne l'icône correspondant au statut
   */
  getStatusIcon(date: Date): string {
    return this.isBirthdayPassed(date) ? 'event_busy' : 'event_available';
  }

  /**
   * Retourne le texte correspondant au statut
   */
  getStatusText(date: Date): string {
    return this.isBirthdayPassed(date)
      ? this.translocoService.translate('birthdayDetails.status.past')
      : this.translocoService.translate('birthdayDetails.status.coming');
  }

  /**
   * Calcul de l'âge
   */
  calculateAge(birthdate: Date): number {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  getCategoryIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'family':
        return 'family_restroom';
      case 'friend':
        return 'group';
      case 'colleague':
        return 'work';
      case 'business':
        return 'business_center';
      default:
        return 'category';
    }
  }

  /**
   * Gestion de l'édition
   */
  onEdit(): void {}
}
