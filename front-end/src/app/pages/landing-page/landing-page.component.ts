import { 
  Component, 
  inject, 
  ViewChild, 
  signal, 
  computed, 
  effect, 
  OnInit, 
  AfterViewInit 
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// Material Modules
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// Services & Components
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AuthService } from './../../core/services/auth/auth.service';
import { BirthdayService } from '../../core/services/birthday/birthday.service';
import { DialogService } from '../../shared/services/dialog/dialog.service';
import { NotificationService } from './../../shared/services/notification/notification.service';
import { Birthday } from './../../models/birthday.model';

// Dialogs & Child Components
import { ProfilComponent } from '../profil/profil.component';
import { NotificationComponent } from '../notification/notification.component';
import { InformationComponent } from '../information/information.component';
import { BirthdayDetailsComponent } from '../birthday-details/birthday-details.component';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { ActivityLogsComponent } from '../activity-logs/activity-logs.component';
import { BirthdayTableComponent } from '../../components/birthday-table/birthday-table.component';
import { BirthdayCardComponent } from '../../components/birthday-card/birthday-card.component';
import { AsideNavBarComponent } from '../../components/aside-nav-bar/aside-nav-bar.component';
import { SetLanguageComponent } from '../../components/set-language/set-language.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule, MatPaginatorModule, MatDividerModule, MatButtonModule, MatIconModule,
    DatePipe, MatFormFieldModule, MatMenuModule, MatBadgeModule, MatCardModule,
    MatInputModule, MatTableModule, MatListModule, MatButtonToggleModule, MatToolbarModule,
    FormsModule, RouterLink, MatTooltipModule, TranslocoModule, MatProgressSpinnerModule,
    BirthdayTableComponent, BirthdayCardComponent, AsideNavBarComponent,
    MatAutocompleteModule, SetLanguageComponent, FooterComponent,
  ],
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  // Functional Injection
  private readonly birthdayService = inject(BirthdayService);
  private readonly dialog = inject(DialogService);
  protected readonly translocoService = inject(TranslocoService);
  readonly authService = inject(AuthService);
  readonly notificationService = inject(NotificationService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // View State Signals
  readonly viewMode = signal<'table' | 'cards'>('table');
  readonly activeButton = signal<'coming' | 'passed'>('coming');
  readonly searchQuery = signal('');
  readonly isDarkTheme = signal(false);
  readonly isLoading = signal(false);
  readonly currentDate = signal(new Date());
  readonly suggestions = signal<string[]>([]);
  
  // Advanced Filter state
  readonly advancedFilter = signal({ column: 'all' });

  readonly availableColumns = [
    { value: 'all', label: 'All columns', icon: 'view_column' },
    { value: 'name', label: 'Name', icon: 'badge' },
    { value: 'city', label: 'City', icon: 'location_city' },
    { value: 'date', label: 'Date', icon: 'calendar_today' },
    { value: 'category', label: 'Category', icon: 'label' },
  ];

  dataSource = new MatTableDataSource<Birthday>();

  // Computed Signal: Replaces combineLatest to automatically filter the list
  readonly filteredBirthdays = computed(() => {
    // birthdays() is now a Signal in our modernized BirthdayService
    const allBirthdays = this.birthdayService.birthdays(); 
    const activeMode = this.activeButton();
    const query = this.searchQuery().toLowerCase();
    const filterColumn = this.advancedFilter().column;
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return allBirthdays.filter((b) => {
      // 1. Filter by date logic
      const bDate = new Date(b.date);
      bDate.setFullYear(now.getFullYear());
      bDate.setHours(0, 0, 0, 0);
      const dateMatch = activeMode === 'coming' ? bDate >= now : bDate < now;

      // 2. Filter by search query logic
      if (!query) return dateMatch;
      const searchMatch = this.matchesAdvancedFilter(b, query, filterColumn);
      
      return dateMatch && searchMatch;
    });
  });

  // Derived state to check if list is empty
  readonly hasBirthdays = computed(() => this.filteredBirthdays().length > 0);

  constructor() {
    // Effect: Automatically sync the MatTableDataSource whenever filteredBirthdays changes
    effect(() => {
      this.dataSource.data = this.filteredBirthdays();
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  ngOnInit(): void {
    // Clock update logic
    setInterval(() => this.currentDate.set(new Date()), 60000);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // --- Actions ---

  setActiveButton(mode: 'coming' | 'passed'): void {
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
    this.isDarkTheme.update(val => !val);
    document.documentElement.classList.toggle('dark', this.isDarkTheme());
  }

  toggleView(mode: 'table' | 'cards'): void {
    this.viewMode.set(mode);
  }

  // --- Dialog & Navigation Handlers ---

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
      error: (err) => console.error('Logout error', err)
    });
  }

  // --- Helper Methods ---

  private matchesAdvancedFilter(birthday: Birthday, query: string, column: string): boolean {
    const q = query.toLowerCase();
    const matches = (field: string | undefined) => field?.toLowerCase().includes(q) ?? false;

    switch (column) {
      case 'name': return matches(birthday.name);
      case 'city': return matches(birthday.city);
      case 'category': return matches(birthday.category);
      case 'date': return birthday.date.toString().includes(q);
      default:
        return matches(birthday.name) || matches(birthday.city) || matches(birthday.category);
    }
  }

  updateSuggestions(query: string): void {
    if (query.length < 2) {
      this.suggestions.set([]);
      return;
    }
    const allValues = this.dataSource.data.map(b => b.name);
    const filtered = [...new Set(allValues)]
      .filter(v => v.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
    this.suggestions.set(filtered);
  }

  selectSuggestion(suggestion: string): void {
    this.searchQuery.set(suggestion);
  }

  getBadgeClass(status: string): string {
    const statusMap: Record<string, string> = {
      'ACTIVE': 'status-active-badge',
      'PENDING': 'status-pending-badge',
      'INACTIVE': 'status-inactive-badge'
    };
    return statusMap[status] || '';
  }

  handleRefresh(): void {
    // Logic to refresh data if necessary
  }

  editBirthday(): void {
    // Implement edit logic
  }
}