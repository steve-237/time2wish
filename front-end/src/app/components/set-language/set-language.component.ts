import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AsideNavBarComponent } from '../aside-nav-bar/aside-nav-bar.component';
import { BirthdayCardComponent } from '../birthday-card/birthday-card.component';
import { BirthdayTableComponent } from '../birthday-table/birthday-table.component';

@Component({
  selector: 'app-set-language',
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatMenuModule,
    MatBadgeModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatListModule,
    MatButtonToggleModule,
    MatToolbarModule,
    FormsModule,
    MatTooltipModule,
    TranslocoModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
  ],
  templateUrl: './set-language.component.html',
  styleUrl: './set-language.component.css',
})
export class SetLanguageComponent {
  languages = [
    { code: 'fr', name: 'Français', flag: 'https://flagcdn.com/w20/fr.png' },
    { code: 'us', name: 'English', flag: 'https://flagcdn.com/w20/us.png' },
    { code: 'de', name: 'Deutsch', flag: 'https://flagcdn.com/w20/de.png' },
  ];
  protected translocoService = inject(TranslocoService);

  currentLanguage = 'fr';

  changeLanguage(lang: string) {
    this.currentLanguage = lang;
    this.translocoService.setActiveLang(lang);
  }
}
