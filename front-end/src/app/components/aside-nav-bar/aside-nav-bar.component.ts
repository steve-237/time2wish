import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';

import { SettingComponent } from '../../pages/setting/setting.component';
import { NewBirthdayComponent } from '../../pages/new-birthday/new-birthday.component';
import { DialogService } from '../../shared/services/dialog/dialog.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { VersionService } from '../../shared/services/version/version.service';
import { StatisticComponent } from '../../pages/statistic/statistic.component';
import { PricingComponent } from '../../pages/pricing/pricing.component';

@Component({
  selector: 'app-aside-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatMenuModule,
    MatToolbarModule,
    FormsModule,
    MatTooltipModule,
    TranslocoModule,
  ],
  templateUrl: './aside-nav-bar.component.html',
})
export class AsideNavBarComponent implements OnInit {
  // Functional Injection
  private readonly dialog = inject(DialogService);
  private readonly versionService = inject(VersionService);
  readonly authService = inject(AuthService);

  // Signals for local state management
  readonly expanded = signal(false);
  readonly version = signal('');

  ngOnInit(): void {
    // Setting signal value from service
    this.version.set(this.versionService.version);
  }

  toggleSidebar(): void {
    this.expanded.update((val) => !val);
  }

  onSetting(): void {
    this.dialog.open(SettingComponent);
  }

  onAddBirthday(): void {
    this.dialog.open(NewBirthdayComponent);
  }

  onStatistics(): void {
    this.dialog.open(StatisticComponent);
  }

  onPricing(): void {
    this.dialog.open(PricingComponent);
  }
}