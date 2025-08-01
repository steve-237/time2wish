import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Birthday } from '../../../models/birthday.model';
import { BirthdayService } from '../../../core/services/birthday/birthday.service';

interface Notification {
icon: any;
  id: string;
  title: string;
  message: string;
  read: boolean;
  date: Date;
  type: 'birthday' | 'system';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private authService: AuthService, private birthdayService: BirthdayService) {
    // Vérifier les anniversaires au démarrage
    this.checkBirthdays();
    this.updateUnreadCount();
    
    // Planifier une vérification quotidienne
    setInterval(() => this.checkBirthdays(), 24 * 60 * 60 * 1000);
  }

  private checkBirthdays(): void {
    if (!this.authService.isLoggedIn()) return;

    // Récupération des anniversaires depuis le BirthdayService
    this.birthdayService.birthdays$.subscribe(birthdays => {
      const today = new Date();
      const todayStr = `${today.getMonth() + 1}/${today.getDate()}`;
      
      const birthdayNotifications = birthdays
        .filter(b => {
          const bDate = new Date(b.date);
          const bDateStr = `${bDate.getMonth() + 1}/${bDate.getDate()}`;
          return bDateStr === todayStr;
        })
        .map(b => ({
          id: `bday-${b.id}-${today.getFullYear()}`,
          title: "Anniversaire aujourd'hui!",
          message: `C'est l'anniversaire de ${b.name} !`,
          read: false,
          date: new Date(),
          type: 'birthday' as const,
          icon: ''
        }));

      this.addNotifications(birthdayNotifications);
    });
  }

  addNotifications(notifications: Notification[]): void {
    const current = this.notificationsSubject.value;
    const newNotifications = notifications.filter(n => 
      !current.some(cn => cn.id === n.id)
    );
    
    if (newNotifications.length > 0) {
      const updated = [...newNotifications, ...current];
      this.notificationsSubject.next(updated);
      this.updateUnreadCount();
    }
  }

  markAsRead(id: string): void {
    const updated = this.notificationsSubject.value.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(updated);
    this.updateUnreadCount();
  }

  markAllAsRead(): void {
    const updated = this.notificationsSubject.value.map(n => ({
      ...n,
      read: true
    }));
    this.notificationsSubject.next(updated);
    this.updateUnreadCount();
  }

  private updateUnreadCount(): void {
    const count = this.notificationsSubject.value.filter(n => !n.read).length;
    this.unreadCountSubject.next(count);
  }

  getUnreadNotifications(): Notification[] {
    return this.notificationsSubject.value.filter(n => !n.read);
  }
}
