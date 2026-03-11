import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { UserProfile } from '../../../models/user.model';
import { Birthday } from '../../../models/birthday.model';
import { AsideNavBarComponent } from '../../../components/aside-nav-bar/aside-nav-bar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { LandingPageHeaderComponent } from './components/landing-page-header/landing-page-header.component';
import { LandingPageContentComponent } from './components/landing-page-content/landing-page-content.component';
import type { LandingFilterMode, LandingViewMode } from '../landing-page.component';

@Component({
  selector: 'app-landing-page-view',
  standalone: true,
  imports: [
    AsideNavBarComponent,
    CommonModule,
    FooterComponent,
    LandingPageContentComponent,
    LandingPageHeaderComponent,
  ],
  templateUrl: './landing-page-view.component.html',
})
export class LandingPageViewComponent {
  @Input({ required: true }) viewMode!: LandingViewMode;
  @Input({ required: true }) activeButton!: LandingFilterMode;
  @Input({ required: true }) searchQuery!: string;
  @Input({ required: true }) isDarkTheme!: boolean;
  @Input({ required: true }) isLoading!: boolean;
  @Input({ required: true }) currentDate!: Date;
  @Input({ required: true }) suggestions!: string[];
  @Input({ required: true }) advancedFilterColumn!: string;
  @Input({ required: true }) availableColumns!: { value: string; label: string; icon: string }[];
  @Input({ required: true }) unreadNotifications!: number;
  @Input({ required: true }) currentUser: UserProfile | null = null;
  @Input({ required: true }) hasBirthdays!: boolean;
  @Input({ required: true }) filteredBirthdays!: Birthday[];

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
  @Output() birthdayEdit = new EventEmitter<void>();
  @Output() birthdayDelete = new EventEmitter<number>();
  @Output() birthdayDetails = new EventEmitter<Birthday>();
  @Output() refresh = new EventEmitter<void>();
}
