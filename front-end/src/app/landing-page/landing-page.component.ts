import { Component, ViewChild } from '@angular/core';
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
import { DialogService } from '../shared/dialog.service';
import { FormsModule } from '@angular/forms';
import { ProfilComponent } from '../profil/profil.component';
import { RouterLink } from '@angular/router';
import { NotificationComponent } from '../notification/notification.component';
import { InformationComponent } from '../information/information.component';
import { SettingComponent } from '../setting/setting.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';

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
    MatCardTitle,
    MatCardSubtitle,
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
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  activeButton: 'coming' | 'passed' = 'coming';
  displayedColumns: string[] = [
    'photo',
    'name',
    'city',
    'category',
    'date',
    'action',
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

  constructor(private dialog: DialogService) {}

  ngOnInit() {
    setInterval(() => {
      this.currentDate = new Date();
    }, 60000);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
    this.dialog.open(NewBirthdayComponent, { width: 'auto' });
  }

  onProfil() {
    this.dialog.open(ProfilComponent, { width: 'auto' });
  }

  onNotification() {
    this.dialog.open(NotificationComponent, { width: 'auto' });
  }

  onInformation() {
    this.dialog.open(InformationComponent, { width: 'auto' });
  }

  onSetting() {
    this.dialog.open(SettingComponent, { width: 'auto' });
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

  deleteBirthday(birthdayId: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Logique de suppression ici
        console.log('Suppression confirmée pour', birthdayId);
        // this.birthdayService.delete(birthdayId).subscribe(...);
      }
    });
  }

  mockData = [
    {
      id: 0,
      photo: 'https://randomuser.me/api/portraits/women/44.jpg',
      name: 'Sophie Martin',
      city: 'Paris',
      category: 'Family',
      date: new Date('2023-05-15'),
    },
    {
      id: 1,
      photo: 'https://randomuser.me/api/portraits/men/32.jpg',
      name: 'Jean Dupont',
      city: 'Lyon',
      category: 'Friend',
      date: new Date('2023-06-20'),
    },
    {
      id: 2,
      photo: 'https://randomuser.me/api/portraits/women/68.jpg',
      name: 'Marie Leroy',
      city: 'Marseille',
      category: 'Colleague',
      date: new Date('2023-07-10'),
    },
    {
      id: 3,
      photo: 'https://randomuser.me/api/portraits/men/75.jpg',
      name: 'Pierre Bernard',
      city: 'Toulouse',
      category: 'Family',
      date: new Date('2023-08-05'),
    },
    {
      id: 4,
      photo: 'https://randomuser.me/api/portraits/women/25.jpg',
      name: 'Julie Petit',
      city: 'Nice',
      category: 'Friend',
      date: new Date('2023-09-12'),
    },
    {
      id: 5,
      photo: 'https://randomuser.me/api/portraits/women/25.jpg',
      name: 'Camille Petit',
      city: 'Nice',
      category: 'Friend',
      date: new Date('2023-09-18'),
    },
    {
      id: 6,
      photo: 'https://randomuser.me/api/portraits/men/55.jpg',
      name: 'Nicolas Moreau',
      city: 'Bordeaux',
      category: 'Family',
      date: new Date('2023-10-22'),
    },
    {
      id: 7,
      photo: 'https://randomuser.me/api/portraits/women/33.jpg',
      name: 'Amélie Laurent',
      city: 'Lille',
      category: 'Colleague',
      date: new Date('2023-11-30'),
    },
    {
      id: 8,
      photo: 'https://randomuser.me/api/portraits/men/12.jpg',
      name: 'Pierre Garnier',
      city: 'Strasbourg',
      category: 'Business',
      date: new Date('2024-01-15'),
    },
    {
      id: 9,
      photo: 'https://randomuser.me/api/portraits/women/87.jpg',
      name: 'Juliette Roux',
      city: 'Nantes',
      category: 'Friend',
      date: new Date('2024-02-20'),
    },
    {
      id: 10,
      photo: 'https://randomuser.me/api/portraits/men/90.jpg',
      name: 'Antoine Fournier',
      city: 'Montpellier',
      category: 'Family',
      date: new Date('2024-03-10'),
    },
    {
      id: 11,
      photo: 'https://randomuser.me/api/portraits/women/56.jpg',
      name: 'Clara Mercier',
      city: 'Rennes',
      category: 'Colleague',
      date: new Date('2024-04-05'),
    },
    {
      id: 12,
      photo: 'https://randomuser.me/api/portraits/men/43.jpg',
      name: 'Lucas Lambert',
      city: 'Grenoble',
      category: 'Business',
      date: new Date('2024-05-18'),
    },
    {
      id: 13,
      photo: 'https://randomuser.me/api/portraits/women/22.jpg',
      name: 'Chloé Girard',
      city: 'Dijon',
      category: 'Friend',
      date: new Date('2024-06-22'),
    },
    {
      id: 14,
      photo: 'https://randomuser.me/api/portraits/men/67.jpg',
      name: 'Hugo Blanc',
      city: 'Angers',
      category: 'Family',
      date: new Date('2024-07-30'),
    },
    {
      id: 15,
      photo: 'https://randomuser.me/api/portraits/women/91.jpg',
      name: 'Zoé Chevalier',
      city: 'Clermont-Ferrand',
      category: 'Colleague',
      date: new Date('2024-08-15'),
    },
  ];

  dataSource = new MatTableDataSource(this.mockData);
}
