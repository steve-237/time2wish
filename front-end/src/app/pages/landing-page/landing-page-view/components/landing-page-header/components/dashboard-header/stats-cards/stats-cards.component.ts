import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface DashboardStatCard {
  id: string;
  label: string;
  value: number;
  icon: string;
  iconClass: string;
  cardClass: string;
}

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './stats-cards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsCardsComponent {
  @Input({ required: true }) cards: DashboardStatCard[] = [];
}
