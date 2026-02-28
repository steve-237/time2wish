import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

import { RegistrationComponent } from '../registration/registration.component';
import { DialogService } from '../../shared/services/dialog/dialog.service';
import { ThemeService } from '../../shared/services/theme/theme.service';
import { SetLanguageComponent } from '../../components/set-language/set-language.component';

@Component({
  selector: 'app-public-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
    SetLanguageComponent,
  ],
  templateUrl: './public-landing.component.html',
})
export class PublicLandingComponent {
  private readonly dialog = inject(DialogService);
  private readonly translocoService = inject(TranslocoService);
  readonly themeService = inject(ThemeService);
  readonly isDarkTheme = this.themeService.isDarkTheme;

  readonly features = [
    { icon: 'calendar_month', titleKey: 'landing.features.items.centralized.title', descriptionKey: 'landing.features.items.centralized.description' },
    { icon: 'notifications_active', titleKey: 'landing.features.items.alerts.title', descriptionKey: 'landing.features.items.alerts.description' },
    { icon: 'dashboard_customize', titleKey: 'landing.features.items.views.title', descriptionKey: 'landing.features.items.views.description' },
    { icon: 'language', titleKey: 'landing.features.items.multilingual.title', descriptionKey: 'landing.features.items.multilingual.description' },
    { icon: 'history', titleKey: 'landing.features.items.logs.title', descriptionKey: 'landing.features.items.logs.description' },
    { icon: 'security', titleKey: 'landing.features.items.security.title', descriptionKey: 'landing.features.items.security.description' },
  ];

  readonly reasons = [
    'landing.why.items.time',
    'landing.why.items.relationship',
    'landing.why.items.reminders',
    'landing.why.items.platform',
  ];

  readonly targetAudience = [
    'landing.target.items.individuals',
    'landing.target.items.assistants',
    'landing.target.items.managers',
    'landing.target.items.communities',
  ];

  readonly interfaces = [
    {
      titleKey: 'landing.interfaces.items.login.title',
      descriptionKey: 'landing.interfaces.items.login.description',
      image: 'assets/img/interface-login.svg',
    },
    {
      titleKey: 'landing.interfaces.items.dashboard.title',
      descriptionKey: 'landing.interfaces.items.dashboard.description',
      image: 'assets/img/interface-dashboard.svg',
    },
    {
      titleKey: 'landing.interfaces.items.notifications.title',
      descriptionKey: 'landing.interfaces.items.notifications.description',
      image: 'assets/img/interface-notifications.svg',
    },
  ];

  t(key: string): string {
    return this.translocoService.translate(key);
  }

  openRegistrationModal(): void {
    this.dialog.open(RegistrationComponent, { width: '620px' });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
