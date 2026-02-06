import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { AuthService } from '../../../core/services/auth/auth.service';
import { BirthdayService } from '../../../core/services/birthday/birthday.service';
import { Birthday } from '../../../models/birthday.model';

/**
 * Interface for internal notification structure
 */
interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  date: Date;
  type: 'birthday' | 'system';
  icon: string;
  action?: {
    label: string;
    callback: () => void;
  };
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // Functional Injection
  private readonly authService = inject(AuthService);
  private readonly birthdayService = inject(BirthdayService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translocoService = inject(TranslocoService);

  // State Management with Signals
  private readonly _notifications = signal<Notification[]>([]);
  
  // Publicly exposed read-only signal
  readonly notifications = this._notifications.asReadonly();

  // Computed signal for unread count (replaces BehaviorSubject + subscription logic)
  readonly unreadCount = computed(() => 
    this._notifications().filter((n) => !n.read).length
  );

  constructor() {
    /**
     * Effect to check birthdays whenever the birthday signal updates.
     * This replaces manual subscriptions and automatically handles clean-up.
     */
    effect(() => {
      if (!this.authService.isAuthenticated()) return;
      
      const birthdays = this.birthdayService.birthdays();
      this.processBirthdayNotifications(birthdays);
    });

    // Schedule a daily check
    setInterval(() => {
       if (this.authService.isAuthenticated()) {
         this.processBirthdayNotifications(this.birthdayService.birthdays());
       }
    }, 24 * 60 * 60 * 1000);
  }

  /**
   * Logic to transform birthdays into notifications
   */
  private processBirthdayNotifications(birthdays: Birthday[]): void {
    const today = new Date();
    const todayStr = `${today.getMonth() + 1}/${today.getDate()}`;

    const birthdayNotifications: Notification[] = birthdays
      .filter((b) => {
        const bDate = new Date(b.date);
        const bDateStr = `${bDate.getMonth() + 1}/${bDate.getDate()}`;
        return bDateStr === todayStr;
      })
      .map((b) => ({
        id: `bday-${b.id}-${today.getFullYear()}`,
        title: this.translocoService.translate('notifications.types.birthday.title'),
        message: this.translocoService.translate('notifications.types.birthday.message', { name: b.name }),
        read: false,
        date: new Date(),
        type: 'birthday' as const,
        icon: 'cake',
      }));

    if (birthdayNotifications.length > 0) {
      this.addNotifications(birthdayNotifications);
    }
  }

  addNotifications(newOnes: Notification[]): void {
    this._notifications.update((current) => {
      // Avoid duplicates based on ID
      const filteredNew = newOnes.filter(
        (n) => !current.some((cn) => cn.id === n.id)
      );
      return [...filteredNew, ...current];
    });
  }

  markAsRead(id: string): void {
    this._notifications.update((list) =>
      list.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  markAllAsRead(): void {
    this._notifications.update((list) =>
      list.map((n) => ({ ...n, read: true }))
    );
  }

  // --- UI SnackBar Methods ---

  showSuccess(messageKey: string): void {
    this.openSnackBar(messageKey, 'success-snackbar', 3000);
  }

  showError(messageKey: string): void {
    this.openSnackBar(messageKey, 'error-snackbar', 5000);
  }

  showInfo(messageKey: string): void {
    this.openSnackBar(messageKey, 'info-snackbar', 3000);
  }

  showWarning(messageKey: string): void {
    this.openSnackBar(messageKey, 'warning-snackbar', 4000);
  }

  private openSnackBar(messageKey: string, panelClass: string, duration: number): void {
    const message = this.translocoService.translate(messageKey);
    const closeLabel = this.translocoService.translate('notifications.actions.close');
    
    this.snackBar.open(message, closeLabel, {
      duration,
      panelClass: [panelClass],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}