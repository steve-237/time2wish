import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';
import { NotificationService } from '../../shared/services/notification/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    TranslocoModule, // Standard Transloco module for pipes
  ],
  templateUrl: './notification.component.html',
})
export class NotificationComponent {
  // Functional injection of the service
  public readonly notificationService = inject(NotificationService);

  /**
   * Helper to format the time
   * Note: In a real production app, consider using a custom Signal-based 
   * "TimeAgo" pipe for better performance.
   */
  getTimeAgo(date: Date): string {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}