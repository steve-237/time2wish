import { Component } from '@angular/core';
import { NotificationService } from '../shared/notification.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [
    MatDialogModule,
    MatBadgeModule,
    MatIconModule,
    MatButtonModule,
    AsyncPipe
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {

  constructor(public notificationService: NotificationService) {}

  getTimeAgo(date: Date) {
    // Implémentez votre logique de formatage de date ici
    return 'Il y a 2h';
  }
}
