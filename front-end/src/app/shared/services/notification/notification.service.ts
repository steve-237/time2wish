import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { BirthdayService } from '../../../core/services/birthday/birthday.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  date: Date;
  type: 'birthday' | 'system';
  icon: string; // Nom de l'icône Material
  action?: {
    label: string;
    callback: () => void;
  };
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private authService: AuthService,
    private birthdayService: BirthdayService,
    private snackBar: MatSnackBar,
    private translocoService: TranslocoService
  ) {
    // Vérifier les anniversaires au démarrage
    this.checkBirthdays();
    this.updateUnreadCount();

    // Planifier une vérification quotidienne
    setInterval(() => this.checkBirthdays(), 24 * 60 * 60 * 1000);
  }

  private checkBirthdays(): void {
    if (!this.authService.isLoggedIn()) return;

    this.birthdayService.birthdays$.subscribe((birthdays) => {
      const today = new Date();
      const todayStr = `${today.getMonth() + 1}/${today.getDate()}`;

      const birthdayNotifications = birthdays
        .filter((b) => {
          const bDate = new Date(b.date);
          const bDateStr = `${bDate.getMonth() + 1}/${bDate.getDate()}`;
          return bDateStr === todayStr;
        })
        .map((b) => ({
          id: `bday-${b.id}-${today.getFullYear()}`,
          // Utilisation de translate avec des paramètres pour le nom
          title: this.translocoService.translate('notifications.types.birthday.title'),
          message: this.translocoService.translate('notifications.types.birthday.message', { name: b.name }),
          read: false,
          date: new Date(),
          type: 'birthday' as const,
          icon: 'cake',
        }));

      this.addNotifications(birthdayNotifications);
    });
  }

  addNotifications(notifications: Notification[]): void {
    const current = this.notificationsSubject.value;
    const newNotifications = notifications.filter(
      (n) => !current.some((cn) => cn.id === n.id)
    );

    if (newNotifications.length > 0) {
      const updated = [...newNotifications, ...current];
      this.notificationsSubject.next(updated);
      this.updateUnreadCount();
    }
  }

  markAsRead(id: string): void {
    const updated = this.notificationsSubject.value.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(updated);
    this.updateUnreadCount();
  }

  markAllAsRead(): void {
    const updated = this.notificationsSubject.value.map((n) => ({
      ...n,
      read: true,
    }));
    this.notificationsSubject.next(updated);
    this.updateUnreadCount();
  }

  private updateUnreadCount(): void {
    const count = this.notificationsSubject.value.filter((n) => !n.read).length;
    this.unreadCountSubject.next(count);
  }

  getUnreadNotifications(): Notification[] {
    return this.notificationsSubject.value.filter((n) => !n.read);
  }

  addSuccessNotification(messageKey: string, icon: string = 'check_circle'): void {
    this.addNotifications([
      {
        id: `success-${Date.now()}`,
        title: this.translocoService.translate('notifications.types.system.success'),
        message: this.translocoService.translate(messageKey),
        read: false,
        date: new Date(),
        type: 'system',
        icon,
      },
    ]);
  }

  showSuccess(messageKey: string): void {
    const message = this.translocoService.translate(messageKey);
    const closeLabel = this.translocoService.translate('notifications.actions.close');
    this.snackBar.open(message, closeLabel, {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  showError(messageKey: string): void {
    const message = this.translocoService.translate(messageKey);
    const closeLabel = this.translocoService.translate('notifications.actions.close');
    this.snackBar.open(message, closeLabel, {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  showInfo(messageKey: string): void {
    const message = this.translocoService.translate(messageKey);
    const closeLabel = this.translocoService.translate('notifications.actions.close');
    this.snackBar.open(message, closeLabel, {
      duration: 3000,
      panelClass: ['info-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  showWarning(messageKey: string): void {
    const message = this.translocoService.translate(messageKey);
    const closeLabel = this.translocoService.translate('notifications.actions.close');
    this.snackBar.open(message, closeLabel, {
      duration: 4000,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
