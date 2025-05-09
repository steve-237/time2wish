import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  date: Date;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notifications = new BehaviorSubject<Notification[]>([
    {
      id: 1,
      title: 'Nouveau message',
      message: 'Vous avez reçu un nouveau message de Jean',
      read: false,
      date: new Date(),
      icon: 'email'
    },
    {
      id: 2,
      title: 'Rappel anniversaire',
      message: "L'anniversaire de Marie est dans 3 jours",
      read: true,
      date: new Date(Date.now() - 86400000),
      icon: 'cake'
    },
    {
      id: 3,
      title: 'Mise à jour',
      message: 'Nouvelle version disponible (v2.1.0)',
      read: false,
      date: new Date(Date.now() - 172800000),
      icon: 'update'
    }
  ]);

  notifications$ = this.notifications.asObservable();

  markAsRead(id: number) {
    const updated = this.notifications.value.map(n => 
      n.id === id ? {...n, read: true} : n
    );
    this.notifications.next(updated);
  }

  markAllAsRead() {
    const updated = this.notifications.value.map(n => ({...n, read: true}));
    this.notifications.next(updated);
  }
}
