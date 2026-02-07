import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-set-language',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslocoModule,
    MatBadgeModule
  ],
  templateUrl: './set-language.component.html',
})
export class SetLanguageComponent {
  private readonly translocoService = inject(TranslocoService);

  // Liste des langues supportées
  readonly languages = [
    { code: 'fr', name: 'Français', flag: 'https://flagcdn.com/w20/fr.png' },
    { code: 'en', name: 'English', flag: 'https://flagcdn.com/w20/gb.png' }, // 'en' est plus standard pour i18n
    { code: 'de', name: 'Deutsch', flag: 'https://flagcdn.com/w20/de.png' },
  ];

  // Signal pour la langue actuelle
  readonly currentLanguage = signal(this.translocoService.getActiveLang());

  /**
   * Change la langue active de l'application
   * @param langCode Code de la langue (fr, en, de)
   */
  changeLanguage(langCode: string): void {
    this.translocoService.setActiveLang(langCode);
    this.currentLanguage.set(langCode);
  }

  // Getter pour obtenir le drapeau de la langue active
  get currentFlag(): string {
    const lang = this.languages.find(l => l.code === this.currentLanguage());
    return lang?.flag || this.languages[0].flag;
  }
}