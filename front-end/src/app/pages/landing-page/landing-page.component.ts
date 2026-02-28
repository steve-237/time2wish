import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from './../../core/services/auth/auth.service';
import { BirthdayService } from '../../core/services/birthday/birthday.service';
import { DialogService } from '../../shared/services/dialog/dialog.service';
import { NotificationService } from './../../shared/services/notification/notification.service';
import { Birthday } from './../../models/birthday.model';

import { ProfilComponent } from '../profil/profil.component';
import { NotificationComponent } from '../notification/notification.component';
import { InformationComponent } from '../information/information.component';
import { BirthdayDetailsComponent } from '../birthday-details/birthday-details.component';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { ActivityLogsComponent } from '../activity-logs/activity-logs.component';
import { ThemeService } from '../../shared/services/theme/theme.service';
import { LandingPageViewComponent } from './landing-page-view/landing-page-view.component';

export type LandingViewMode = 'table' | 'cards';
export type LandingFilterMode = 'coming' | 'passed';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, LandingPageViewComponent],
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent implements OnInit {
  private readonly birthdayService = inject(BirthdayService);
  private readonly dialog = inject(DialogService);

  readonly authService = inject(AuthService);
  readonly notificationService = inject(NotificationService);
  readonly themeService = inject(ThemeService);

  readonly viewMode = signal<LandingViewMode>('table');
  readonly activeButton = signal<LandingFilterMode>('coming');
  readonly searchQuery = signal('');
  readonly isDarkTheme = this.themeService.isDarkTheme;
  readonly isLoading = signal(false);
  readonly currentDate = signal(new Date());
  readonly suggestions = signal<string[]>([]);
  readonly advancedFilter = signal({ column: 'all' });

  readonly availableColumns = [
    { value: 'all', label: 'All columns', icon: 'view_column' },
    { value: 'name', label: 'Name', icon: 'badge' },
    { value: 'city', label: 'City', icon: 'location_city' },
    { value: 'date', label: 'Date', icon: 'calendar_today' },
    { value: 'category', label: 'Category', icon: 'label' },
  ];

  readonly filteredBirthdays = computed(() => {
    const allBirthdays = this.birthdayService.birthdays();
    const activeMode = this.activeButton();
    const query = this.searchQuery().toLowerCase();
    const filterColumn = this.advancedFilter().column;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return allBirthdays.filter((birthday) => {
      const bDate = new Date(birthday.date);
      bDate.setFullYear(now.getFullYear());
      bDate.setHours(0, 0, 0, 0);
      const dateMatch = activeMode === 'coming' ? bDate >= now : bDate < now;

      if (!query) {
        return dateMatch;
      }

      const searchMatch = this.matchesAdvancedFilter(birthday, query, filterColumn);
      return dateMatch && searchMatch;
    });
  });

  readonly hasBirthdays = computed(() => this.filteredBirthdays().length > 0);

  ngOnInit(): void {
    setInterval(() => this.currentDate.set(new Date()), 60000);
  }

  setActiveButton(mode: LandingFilterMode): void {
    this.isLoading.set(true);
    this.activeButton.set(mode);
    setTimeout(() => this.isLoading.set(false), 800);
  }

  updateSearch(query: string): void {
    this.searchQuery.set(query.trim());
    this.updateSuggestions(query);
  }

  updateAdvancedFilter(column: string): void {
    this.advancedFilter.set({ column });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleView(mode: LandingViewMode): void {
    this.viewMode.set(mode);
  }

  onProfil(): void {
    this.dialog.open(ProfilComponent, { width: '500px' });
  }

  onNotification(): void {
    this.dialog.open(NotificationComponent);
  }

  openBirthdayDetails(birthday: Birthday): void {
    this.dialog.open(BirthdayDetailsComponent, { width: '600px', data: birthday });
  }

  onInformation(): void {
    this.dialog.open(InformationComponent);
  }

  openActivityLogs(): void {
    this.dialog.open(ActivityLogsComponent, { width: '650px', data: { filter: 'all' } });
  }

  deleteBirthday(birthdayId: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.birthdayService.deleteBirthday(birthdayId);
        this.notificationService.showSuccess('BIRTHDAY_DELETED');
      }
    });
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => console.log('Successfully logged out'),
      error: (error) => console.error('Logout error', error),
    });
  }

  handleRefresh(): void {
    // Logic to refresh data if necessary
  }

  editBirthday(): void {
    // Implement edit logic
  }

  private matchesAdvancedFilter(birthday: Birthday, query: string, column: string): boolean {
    const matches = (field: string | undefined) => field?.toLowerCase().includes(query) ?? false;

    switch (column) {
      case 'name':
        return matches(birthday.name);
      case 'city':
        return matches(birthday.city);
      case 'category':
        return matches(birthday.category);
      case 'date':
        return birthday.date.toString().includes(query);
      default:
        return matches(birthday.name) || matches(birthday.city) || matches(birthday.category);
    }
  }

  private updateSuggestions(query: string): void {
    if (query.length < 2) {
      this.suggestions.set([]);
      return;
    }

    const allValues = this.birthdayService.birthdays().map((birthday) => birthday.name);
    const filtered = [...new Set(allValues)]
      .filter((value) => value.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);

    this.suggestions.set(filtered);
  }
}
