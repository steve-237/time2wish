import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

import { BirthdayService } from '../../../../../../../core/services/birthday/birthday.service';
import { Birthday } from '../../../../../../../models/birthday.model';
import { LandingFilterMode } from '../../../../../landing-page.component';
import { ToggleSwitchComponent } from './toggle-switch/toggle-switch.component';
import { StatsCardsComponent, DashboardStatCard } from './stats-cards/stats-cards.component';

@Component({
  selector: 'app-birthday-dashboard-header-container',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslocoModule, ToggleSwitchComponent, StatsCardsComponent],
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
    const weeklyCount = this.countBirthdaysInRange(birthdays, 0, 6);
    const todayCount = this.countBirthdaysInRange(birthdays, 0, 0);
    const nextFourteenDaysCount = this.countBirthdaysInRange(birthdays, 1, 14);
    const totalContactsCount = Array.isArray(birthdays) ? birthdays.length : 0;

    return [
      {
        id: 'weekly',
        labelKey: 'dashboard_header.stats.weekly',
        value: weeklyCount,
        icon: 'cake',
        iconClass: 'text-indigo-600',
        cardClass: 'from-indigo-50 to-indigo-100/40',
      },
      {
        id: 'today',
        labelKey: 'dashboard_header.stats.today',
        value: todayCount,
        icon: 'celebration',
        iconClass: 'text-rose-600',
        cardClass: 'from-rose-50 to-rose-100/40',
      },
      {
        id: 'next-14-days',
        labelKey: 'dashboard_header.stats.next_14_days',
        value: nextFourteenDaysCount,
        icon: 'event_available',
        iconClass: 'text-blue-600',
        cardClass: 'from-blue-50 to-blue-100/40',
      },
      {
        id: 'total',
        labelKey: 'dashboard_header.stats.total_contacts',
        value: totalContactsCount,
        icon: 'groups',
        iconClass: 'text-violet-600',
        cardClass: 'from-violet-50 to-violet-100/40',
      },
    ];
  });

  onModeChange(mode: LandingFilterMode): void {
    this.activeButtonChange.emit(mode);
  }

  private countBirthdaysInRange(birthdays: Birthday[], minDays: number, maxDays: number): number {
    if (!Array.isArray(birthdays) || birthdays.length === 0) {
      return 0;
    }

    return birthdays.filter((birthday) => {
      const days = this.getDaysUntilBirthday(birthday.date);
      return days >= minDays && days <= maxDays;
    }).length;
  }

  private getDaysUntilBirthday(date: Date): number {
    const validDate = this.asValidDate(date);
    if (!validDate) {
      return Number.POSITIVE_INFINITY;
    }

    const now = new Date(this.currentDate);
    now.setHours(0, 0, 0, 0);

    const normalizedDate = new Date(validDate);
    normalizedDate.setFullYear(now.getFullYear());
    normalizedDate.setHours(0, 0, 0, 0);

    if (normalizedDate < now) {
      normalizedDate.setFullYear(now.getFullYear() + 1);
    }

    const diffMs = normalizedDate.getTime() - now.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  private asValidDate(input: Date): Date | null {
    const date = new Date(input);
    return Number.isNaN(date.getTime()) ? null : date;
  }
}
