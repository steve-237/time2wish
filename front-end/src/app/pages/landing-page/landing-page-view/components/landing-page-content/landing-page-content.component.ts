import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Birthday } from '../../../../../models/birthday.model';
import { BirthdayCardComponent } from '../../../../../components/birthday-card/birthday-card.component';
import { BirthdayTableComponent } from '../../../../../components/birthday-table/birthday-table.component';
import type { LandingFilterMode, LandingViewMode } from '../../../landing-page.component';

@Component({
  selector: 'app-landing-page-content',
  standalone: true,
  imports: [
    BirthdayCardComponent,
    BirthdayTableComponent,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslocoModule,
  ],
  templateUrl: './landing-page-content.component.html',
})
export class LandingPageContentComponent {
  @Input({ required: true }) isLoading!: boolean;
  @Input({ required: true }) viewMode!: LandingViewMode;
  @Input({ required: true }) hasBirthdays!: boolean;
  @Input({ required: true }) filteredBirthdays!: Birthday[];
  @Input({ required: true }) activeButton!: LandingFilterMode;

  @Output() birthdayEdit = new EventEmitter<void>();
  @Output() birthdayDelete = new EventEmitter<number>();
  @Output() birthdayDetails = new EventEmitter<Birthday>();
  @Output() refresh = new EventEmitter<void>();
}
