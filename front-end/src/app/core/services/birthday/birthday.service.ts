import { Injectable, inject, signal, effect } from '@angular/core';
import { Birthday } from '../../../models/birthday.model';
import { TranslocoService } from '@jsverse/transloco';
import { AuthService } from '../auth/auth.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BirthdayService {
  // Use functional inject() for dependencies
  private readonly authService = inject(AuthService);
  private readonly translocoService = inject(TranslocoService);

  // Define a private writable signal and a public read-only signal
  private readonly _birthdays = signal<Birthday[]>([]);
  readonly birthdays = this._birthdays.asReadonly();

  constructor() {
    /**
     * Use effect() to reactively synchronize birthdays whenever 
     * the authService.currentUser signal changes.
     * This eliminates the need for manual subscriptions and Unsubscribe logic.
     */
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        console.log('Fetching birthdays for user:', user.fullName);
        this._birthdays.set(user.birthdays || []);
      } else {
        this._birthdays.set([]);
      }
    });
  }

  /**
   * Retrieval by ID using signal accessor
   */
  getBirthdayById(id: number): Birthday | undefined {
    return this._birthdays().find((b) => b.id === id);
  }

  /**
   * Adds a birthday and updates the signal state
   */
  addBirthday(birthday: Birthday): void {
    const newBirthday: Birthday = {
      ...birthday,
      id: this.generateId(),
      date: new Date(birthday.date),
    };

    // Update the signal using the update() method (immutable update)
    this._birthdays.update((prev) => [newBirthday, ...prev]);
    
    // TODO: Real HTTP call: this.http.post(...)
  }

  /**
   * Updates an existing birthday in the signal state
   */
  updateBirthday(updated: Birthday): Observable<Birthday> {
    const updatedBirthday: Birthday = {
      ...updated,
      date: new Date(updated.date),
    };

    this._birthdays.update((list) => {
      const index = list.findIndex((b) => b.id === updated.id);
      if (index === -1) throw new Error('Birthday not found');
      
      const newList = [...list];
      newList[index] = updatedBirthday;
      return newList;
    });

    return of(updatedBirthday);
  }

  /**
   * Deletes a birthday from the signal state
   */
  deleteBirthday(id: number): void {
    this._birthdays.update((list) => list.filter((b) => b.id !== id));
  }

  private generateId(): number {
    const current = this._birthdays();
    return current.length ? Math.max(...current.map((b) => b.id)) + 1 : 1;
  }

  /**
   * UI Logic for birthday status
   */
  getBirthdayStatus(birthdayDate: Date) {
    const today = new Date();
    const date = new Date(birthdayDate);
    date.setFullYear(today.getFullYear());

    // Normalize dates to midnight for accurate calculation
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays > 0) {
      return {
        text: this.translocoService.translate('status.coming', { count: diffDays }),
        icon: 'event_upcoming',
        color: 'text-green-500',
      };
    } else if (diffDays === 0) {
      return {
        text: this.translocoService.translate('status.today'),
        icon: 'celebration',
        color: 'text-blue-500',
      };
    } else {
      return {
        text: this.translocoService.translate('status.passed'),
        icon: 'event_busy',
        color: 'text-gray-400',
      };
    }
  }

  /**
   * Helper to calculate current age
   */
  calculateAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
}