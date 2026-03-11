import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SetLanguageComponent } from '../../../../../components/set-language/set-language.component';
import { UserProfile } from '../../../../../models/user.model';
import type { LandingFilterMode, LandingViewMode } from '../../../landing-page.component';

@Component({
  selector: 'app-landing-page-header',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
    NgClass,
    RouterLink,
    SetLanguageComponent,
    TranslocoModule,
  ],
  templateUrl: './landing-page-header.component.html',
})
export class LandingPageHeaderComponent {
  @Input({ required: true }) viewMode!: LandingViewMode;
  @Input({ required: true }) activeButton!: LandingFilterMode;
  @Input({ required: true }) searchQuery!: string;
  @Input({ required: true }) isDarkTheme!: boolean;
  @Input({ required: true }) currentDate!: Date;
  @Input({ required: true }) suggestions!: string[];
  @Input({ required: true }) advancedFilterColumn!: string;
  @Input({ required: true }) availableColumns!: { value: string; label: string; icon: string }[];
  @Input({ required: true }) unreadNotifications!: number;
  @Input({ required: true }) currentUser: UserProfile | null = null;

  @Output() searchChange = new EventEmitter<string>();
  @Output() clearSearch = new EventEmitter<void>();
  @Output() suggestionSelected = new EventEmitter<string>();
  @Output() advancedFilterChange = new EventEmitter<string>();
  @Output() themeToggle = new EventEmitter<void>();
  @Output() notificationOpen = new EventEmitter<void>();
  @Output() viewToggle = new EventEmitter<LandingViewMode>();
  @Output() informationOpen = new EventEmitter<void>();
  @Output() profileOpen = new EventEmitter<void>();
  @Output() activityLogsOpen = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() activeButtonChange = new EventEmitter<LandingFilterMode>();

  get nextViewMode(): LandingViewMode {
    return this.viewMode === 'table' ? 'cards' : 'table';
  }

  getBadgeClass(status: string): string {
    const statusMap: Record<string, string> = {
      ACTIVE: 'status-active-badge',
      PENDING: 'status-pending-badge',
      INACTIVE: 'status-inactive-badge',
    };

    return statusMap[status] || '';
  }
}
