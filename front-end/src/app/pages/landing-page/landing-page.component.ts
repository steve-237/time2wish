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
import {
  MatCardModule,
  MatCardTitle,
  MatCardSubtitle,
} from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NewBirthdayComponent } from '../new-birthday/new-birthday.component';
import { DialogService } from '../../shared/services/dialog/dialog.service';
import { FormsModule } from '@angular/forms';
import { ProfilComponent } from '../profil/profil.component';
import { RouterLink } from '@angular/router';
import { NotificationComponent } from '../notification/notification.component';
import { InformationComponent } from '../information/information.component';
import { SettingComponent } from '../setting/setting.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { BirthdayService } from '../../core/services/birthday/birthday.service';
import {
  BehaviorSubject,
  Subscription,
  combineLatest,
  map,
} from 'rxjs';
import { BirthdayDetailsComponent } from '../birthday-details/birthday-details.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BirthdayTableComponent } from "../../components/birthday-table/birthday-table.component";
import { BirthdayCardComponent } from "../../components/birthday-card/birthday-card.component";

@Component({
  selector: 'app-landing-page',
  imports: [
    CommonModule,
    MatTableModule,
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
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatBadgeModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    MatButtonToggleModule,
    MatToolbarModule,
    FormsModule,
    RouterLink,
    MatTooltipModule,
    MatBadgeModule,
    TranslocoModule,
    MatProgressSpinnerModule,
    BirthdayTableComponent,
    BirthdayCardComponent
],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {
editBirthday() {
throw new Error('Method not implemented.');
}
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected translocoService = inject(TranslocoService);


  languages = [
    { code: 'fr', name: 'Français', flag: 'https://flagcdn.com/w20/fr.png' },
    { code: 'us', name: 'English', flag: 'https://flagcdn.com/w20/us.png' },
    { code: 'de', name: 'Deutsch', flag: 'https://flagcdn.com/w20/de.png' },
  ];

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

  private birthdayService = inject(BirthdayService);
  birthdays = this.birthdayService.birthdays$;
  private activeButtonSubject = new BehaviorSubject<'coming' | 'passed'>(
    'coming'
  );
  activeButton$ = this.activeButtonSubject.asObservable();

  private dataSourceSub?: Subscription;

  constructor(
    private dialog: DialogService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loading = true;
    setInterval(() => {
      this.currentDate = new Date();
    }, 60000);

    this.birthdayService.fetchBirthdays();
    
      this.loading = false;
  }

  ngAfterViewInit(): void {
    this.dataSourceSub = this.filteredBirthdays$.subscribe((birthdays) => {
      this.dataSource.data = birthdays;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      });
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

  toggleSidebar() {
    this.expanded = !this.expanded;
  }

  toggleView(mode: 'table' | 'cards') {
    this.viewMode = mode;
  }

  onAddBirthday() {
    this.dialog.open(NewBirthdayComponent);
  }

  onProfil() {
    this.dialog.open(ProfilComponent, {
      width: '500px',
    });
  }

  onNotification() {
    this.dialog.open(NotificationComponent);
  }

  onInformation() {
    this.dialog.open(InformationComponent);
  }

  onSetting() {
    this.dialog.open(SettingComponent);
  }

  openBirthdayDetails(birthday: Birthday) {
    this.dialog.open(BirthdayDetailsComponent, {
      width: '600px',
      data: birthday
    })
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
        console.log('Suppression confirmée pour', birthdayId);
      }
    });
  }

  currentLanguage = 'fr';

  changeLanguage(lang: string) {
    this.currentLanguage = lang;
    this.translocoService.setActiveLang(lang);
  }

  filteredBirthdays$ = combineLatest([this.birthdays, this.activeButton$]).pipe(
    map(([birthdays, active]) => {
      const now = new Date();
      return birthdays.filter((birthday) => {
        const birthdayDate = new Date(birthday.date);
        birthdayDate.setFullYear(now.getFullYear());

        return active === 'coming' ? birthdayDate >= now : birthdayDate < now;
      });
    })
  );

  hasBirthdays$ = this.filteredBirthdays$.pipe(
    map((birthdays) => birthdays.length > 0)
  );

  
}
