import { NotificationService } from './../../shared/services/notification/notification.service';
import { Birthday } from './../../models/birthday.model';
import { AuthService } from './../../core/services/auth/auth.service';
import { Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DialogService } from '../../shared/services/dialog/dialog.service';
import { FormsModule } from '@angular/forms';
import { ProfilComponent } from '../profil/profil.component';
import { RouterLink } from '@angular/router';
import { NotificationComponent } from '../notification/notification.component';
import { InformationComponent } from '../information/information.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { BirthdayService } from '../../core/services/birthday/birthday.service';
import {
  BehaviorSubject,
  Subscription,
  combineLatest,
  map,
  startWith,
} from 'rxjs';
import { BirthdayDetailsComponent } from '../birthday-details/birthday-details.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BirthdayTableComponent } from '../../components/birthday-table/birthday-table.component';
import { BirthdayCardComponent } from '../../components/birthday-card/birthday-card.component';
import { AsideNavBarComponent } from '../../components/aside-nav-bar/aside-nav-bar.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SetLanguageComponent } from '../../components/set-language/set-language.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ActivityLogsComponent } from '../activity-logs/activity-logs.component';

@Component({
  selector: 'app-landing-page',
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
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
    RouterLink,
    MatTooltipModule,
    TranslocoModule,
    MatProgressSpinnerModule,
    BirthdayTableComponent,
    BirthdayCardComponent,
    AsideNavBarComponent,
    MatAutocompleteModule,
    SetLanguageComponent,
    FooterComponent,
  ],
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {

  editBirthday() {
    throw new Error('Method not implemented.');
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected translocoService = inject(TranslocoService);

  dataSource = new MatTableDataSource<Birthday>();

  get flagBadge() {
    return {
      content: '',
      color: 'warn',
      size: 'small',
      hidden: false,
      overlap: true,
      position: 'above after',
    };
  }

  // Ajoutez ces nouvelles propriétés
  advancedFilter = {
    column: 'all', // 'all', 'firstName', 'lastName', 'date', 'note'
    query: '',
  };

  // Colonnes disponibles pour le filtrage
  availableColumns = [
    { value: 'all', label: 'All columns', icon: 'view_column' },
    { value: 'name', label: 'Name', icon: 'badge' },
    { value: 'city', label: 'City', icon: 'family_restroom' },
    { value: 'date', label: 'Date', icon: 'calendar_today' },
    { value: 'category', label: 'Category', icon: 'notes' },
  ];

  viewMode: 'table' | 'cards' = 'table';

  currentDate: Date = new Date();
  expanded = false;
  showMainSearch = false;
  showTableSearch = false;
  searchQuery = '';
  tableSearchQuery = '';
  showSearchBar = false;
  isDarkTheme = false;
  loading = false;
  suggestions: string[] = [];

  private birthdayService = inject(BirthdayService);
  birthdays = this.birthdayService.birthdays$;
  private activeButtonSubject = new BehaviorSubject<'coming' | 'passed'>(
    'coming'
  );
  activeButton$ = this.activeButtonSubject.asObservable();

  private searchQuerySubject = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuerySubject.asObservable();

  private dataSourceSub?: Subscription;

  constructor(
    private dialog: DialogService,
    public authService: AuthService,
    public notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loading = true;
    setInterval(() => {
      this.currentDate = new Date();
    }, 60000);

    this.loading = false;
  }

  ngAfterViewInit(): void {
    this.dataSourceSub = this.filteredBirthdays$.subscribe((birthdays) => {
      this.dataSource.data = birthdays;
    });
  }

  ngOnDestroy(): void {
    this.dataSourceSub?.unsubscribe();
  }

  setActiveButton(mode: 'coming' | 'passed') {
    this.loading = true;
    this.activeButtonSubject.next(mode);

    setTimeout(() => {
      this.loading = false;
      // this.loadBirthdays(); // Appelez votre méthode de chargement réelle ici
    }, 800);
  }

  toggleMainSearch() {
    this.showMainSearch = !this.showMainSearch;
    if (!this.showMainSearch) this.searchQuery = '';
  }

  toggleTableSearch() {
    this.showTableSearch = !this.showTableSearch;
    if (!this.showTableSearch) this.tableSearchQuery = '';
  }

  performSearch() {
    console.log('Recherche principale:', this.searchQuery);
  }

  onPageChange(event: any) {
    console.log('Page changed:', event);
  }

  toggleView(mode: 'table' | 'cards') {
    this.viewMode = mode;
  }

  onProfil() {
    this.dialog.open(ProfilComponent, {
      width: '500px'
    });
  }

  onNotification() {
    this.dialog.open(NotificationComponent);
  }

  onInformation() {
    this.dialog.open(InformationComponent);
  }

  openBirthdayDetails(birthday: Birthday) {
    this.dialog.open(BirthdayDetailsComponent, {
      width: '600px',
      data: birthday,
    });
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;

    if (this.isDarkTheme) {
      document.documentElement.classList.add('dark');
      // Ou utiliser votre service de thème si vous en avez un
      // this.themeService.setDarkTheme();
    } else {
      document.documentElement.classList.remove('dark');
      // this.themeService.setLightTheme();
    }
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

  filteredBirthdays$ = combineLatest([
    this.birthdays,
    this.activeButton$,
    this.searchQuery$.pipe(startWith('')),
  ]).pipe(
    map(([birthdays, active, searchQuery]) => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      return birthdays.filter((birthday) => {
        // Filtre par date (coming/passed)
        const birthdayDate = new Date(birthday.date);
        birthdayDate.setFullYear(now.getFullYear());
        birthdayDate.setHours(0, 0, 0, 0);

        const dateMatch =
          active === 'coming' ? birthdayDate >= now : birthdayDate < now;

        // Filtre par recherche
        const searchMatch = this.matchesAdvancedFilter(birthday, searchQuery);

        return dateMatch && searchMatch;
      });
    })
  );

  // Méthode pour le filtrage avancé
  private matchesAdvancedFilter(birthday: Birthday, query: string): boolean {
    if (!query) return true;

    const q = query.toLowerCase();

    switch (this.advancedFilter.column) {
      case 'firstName':
        return birthday.name.toLowerCase().includes(q);
      case 'lastName':
        return birthday.city.toLowerCase().includes(q);
      case 'date':
        return birthday.date.toString().includes(q);
      case 'note':
        return birthday.category?.toLowerCase().includes(q) || false;
      default: // 'all'
        return (
          birthday.name.toLowerCase().includes(q) ||
          birthday.city.toLowerCase().includes(q) ||
          birthday.date.toString().includes(q) ||
          birthday.category.toLowerCase().includes(q)
        );
    }
  }

  // Méthode pour mettre à jour le filtre
  updateAdvancedFilter(column: string) {
    this.advancedFilter.column = column;
    this.updateSearchQuery(this.searchQuery); // Rafraîchit les résultats
  }
  updateSearchQuery(query: string) {
    this.searchQuerySubject.next(query.trim());
  }

  hasBirthdays$ = this.filteredBirthdays$.pipe(
    map((birthdays) => birthdays.length > 0)
  );

  getColumnLabel(columnValue: string): string {
    const column = this.availableColumns.find((c) => c.value === columnValue);
    return column ? column.label : '';
  }

  // Méthode pour générer les suggestions
  updateSuggestions(query: string) {
    if (!query || query.length < 2) {
      this.suggestions = [];
      return;
    }

    // Récupère toutes les valeurs possibles selon la colonne sélectionnée
    const allValues = this.dataSource.data.map((birthday) => {
      switch (this.advancedFilter.column) {
        case 'name':
          return birthday.name;
        case 'city':
          return birthday.city;
        case 'category':
          return birthday.category || '';
        default:
          return `${birthday.name} ${birthday.city} ${birthday.category || ''}`;
      }
    });

    console.log('All Values : ', allValues);

    // Filtre et dédoublonne les suggestions
    const queryLower = query.toLowerCase();
    this.suggestions = [...new Set(allValues)]
      .filter((val) => val.toLowerCase().includes(queryLower))
      .slice(0, 5); // Limite à 5 suggestions
  }

  // Méthode pour sélectionner une suggestion
  selectSuggestion(suggestion: string) {
    this.searchQuery = suggestion;
    this.updateSearchQuery(suggestion);
  }

  handleRefresh() {
    this.birthdays = this.birthdayService.birthdays$;
  }

  /**
   * Mappe le statut utilisateur à une couleur de badge Material.
   * @param status Le statut de l'utilisateur (ACTIVE, INACTIVE, PENDING)
   * @returns La couleur Material (primary, accent, warn) ou une couleur personnalisée.
   */
  getBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'status-active-badge'; // Vert
      case 'PENDING':
        return 'status-pending-badge'; // Jaune/Orange
      case 'INACTIVE':
        return 'status-inactive-badge'; // Rouge
      default:
        return ''; // Aucune classe
    }
  }

  openActivityLogs(): void {
    this.dialog.open(ActivityLogsComponent, {
      width: '650px', // Un peu plus large pour voir les détails
      data: { filter: 'all' }
    });
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => console.log('Déconnecté du serveur'),
      error: (err) => console.error('Erreur lors du logout backend', err)
    });
  }
}
