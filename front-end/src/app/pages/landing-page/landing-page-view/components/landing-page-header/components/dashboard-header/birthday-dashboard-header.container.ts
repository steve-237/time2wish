import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';
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
  readonly isStatsVisible = signal(false);

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
        iconClass: '!text-indigo-600', 
        cardClass: 'border-b-2 border-indigo-500 bg-white hover:bg-indigo-50/30 transition-all shadow-sm',
      },
      {
        id: 'today',
        labelKey: 'dashboard_header.stats.today',
        value: todayCount,
        icon: 'auto_awesome',
        iconClass: '!text-rose-600',
        cardClass: 'border-b-2 border-rose-500 bg-white hover:bg-rose-50/30 transition-all shadow-sm',
      },
      {
        id: 'next-14-days',
        labelKey: 'dashboard_header.stats.next_14_days',
        value: nextFourteenDaysCount,
        icon: 'calendar_month',
        iconClass: '!text-blue-600',
        cardClass: 'border-b-2 border-blue-500 bg-white hover:bg-blue-50/30 transition-all shadow-sm',
      },
      {
        id: 'total',
        labelKey: 'dashboard_header.stats.total_contacts',
        value: totalContactsCount,
        icon: 'people',
        iconClass: '!text-violet-600',
        cardClass: 'border-b-2 border-violet-500 bg-white hover:bg-violet-50/30 transition-all shadow-sm',
      }
    ];
  });

  onModeChange(mode: LandingFilterMode): void {
    this.activeButtonChange.emit(mode);
  }

  toggleStatsVisibility(): void {
    this.isStatsVisible.update((visible) => !visible);
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
