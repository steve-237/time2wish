import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

interface ActivityLog {
  id: string;
  type: 'create' | 'update' | 'delete';
  target: string; // Nom de la personne
  timestamp: Date;
  details: string;
}

@Component({
  selector: 'app-activity-logs',
  imports: [CommonModule, MatIconModule, MatDividerModule, TranslocoModule],
  templateUrl: './activity-logs.component.html',
})
export class ActivityLogsComponent {

  activityLogs: ActivityLog[] = [
    { id: '1', type: 'create', target: 'Jean Dupont', timestamp: new Date(), details: 'Nouvel anniversaire ajouté.' },
    { id: '2', type: 'update', target: 'Marie Curie', timestamp: new Date(Date.now() - 3600000), details: 'Numéro de téléphone mis à jour.' },
    { id: '3', type: 'delete', target: 'Ancien Ami', timestamp: new Date(Date.now() - 86400000), details: 'Profil supprimé définitivement.' }
  ];

  getIcon(type: string): string {
    switch (type) {
      case 'create': return 'person_add';
      case 'update': return 'edit';
      case 'delete': return 'person_remove';
      default: return 'info';
    }
  }
}
