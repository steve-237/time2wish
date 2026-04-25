import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { BirthdayService } from '../../../../../../../core/services/birthday/birthday.service';
import { Birthday } from '../../../../../../../models/birthday.model';
import { LandingFilterMode } from '../../../../../landing-page.component';
import { ToggleSwitchComponent } from './toggle-switch/toggle-switch.component';
import { StatsCardsComponent, DashboardStatCard } from './stats-cards/stats-cards.component';
import { DateTimeDisplayComponent } from './date-time-display/date-time-display.component';

@Component({
  selector: 'app-birthday-dashboard-header-container',
  standalone: true,
  imports: [CommonModule, MatIconModule, ToggleSwitchComponent, StatsCardsComponent, DateTimeDisplayComponent],
  templateUrl: './birthday-dashboard-header.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BirthdayDashboardHeaderContainerComponent {
  private readonly birthdayService = inject(BirthdayService);

  @Input({ required: true }) activeButton!: LandingFilterMode;
  @Input({ required: true }) currentDate!: Date;

  @Output() activeButtonChange = new EventEmitter<LandingFilterMode>();

  readonly allBirthdays = computed(() => this.birthdayService.birthdays());

  readonly statsCards = computed<DashboardStatCard[]>(() => {
    const birthdays = this.allBirthdays();

    return [
      {
        id: 'weekly',
        label: 'Anniversaires cette semaine',
        value: this.countBirthdaysInRange(birthdays, 0, 6),
        icon: 'cake',
        iconClass: 'text-indigo-600',
        cardClass: 'bg-indigo-50 border-indigo-100',
      },
      {
        id: 'today',
        label: 'Aujourd’hui',
        value: this.countBirthdaysInRange(birthdays, 0, 0),
        icon: 'celebration',
        iconClass: 'text-rose-600',
        cardClass: 'bg-rose-50 border-rose-100',
      },
      {
        id: 'next-7-days',
        label: 'Dans les 7 prochains jours',
        value: this.countBirthdaysInRange(birthdays, 1, 7),
        icon: 'event_available',
        iconClass: 'text-blue-600',
        cardClass: 'bg-blue-50 border-blue-100',
      },
      {
        id: 'total',
        label: 'Total des contacts',
        value: birthdays.length,
        icon: 'groups',
        iconClass: 'text-violet-600',
        cardClass: 'bg-violet-50 border-violet-100',
      },
    ];
  });

  onModeChange(mode: LandingFilterMode): void {
    this.activeButtonChange.emit(mode);
  }

  private countBirthdaysInRange(birthdays: Birthday[], minDays: number, maxDays: number): number {
    return birthdays.filter((birthday) => {
      const days = this.getDaysUntilBirthday(birthday.date);
      return days >= minDays && days <= maxDays;
    }).length;
  }

  private getDaysUntilBirthday(date: Date): number {
    const now = new Date(this.currentDate);
    now.setHours(0, 0, 0, 0);

    const normalizedDate = new Date(date);
    normalizedDate.setFullYear(now.getFullYear());
    normalizedDate.setHours(0, 0, 0, 0);

    if (normalizedDate < now) {
      normalizedDate.setFullYear(now.getFullYear() + 1);
    }

    const diffMs = normalizedDate.getTime() - now.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }
}
