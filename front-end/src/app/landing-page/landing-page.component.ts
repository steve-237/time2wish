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

@Component({
  selector: 'app-landing-page',
  imports: [
    MatTableModule, 
    MatPaginatorModule, 
    MatDividerModule, 
    MatButtonModule,
    MatIconModule,
    DatePipe,
    MatFormFieldModule,
    MatMenuModule,
    MatBadgeModule
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  activeButton: boolean = false;
  displayedColumns: string[] = ['photo', 'name', 'city', 'category', 'date', 'action'];

  currentDate: Date = new Date();
  expanded = false;

  ngOnInit() {
    setInterval(() => {
      this.currentDate = new Date();
    }, 60000);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onPageChange(event: any) {
    console.log('Page changed:', event);
  }

  toggleSidebar() {
    this.expanded = !this.expanded;
  }

  mockData = [
    { 
      photo: 'https://randomuser.me/api/portraits/women/44.jpg',
      name: 'Sophie Martin', 
      city: 'Paris', 
      category: 'Family', 
      date: new Date('2023-05-15'),
    },
    { 
      photo: 'https://randomuser.me/api/portraits/men/32.jpg',
      name: 'Jean Dupont', 
      city: 'Lyon', 
      category: 'Friend', 
      date: new Date('2023-06-20'),
    },
    { 
      photo: 'https://randomuser.me/api/portraits/women/68.jpg',
      name: 'Marie Leroy', 
      city: 'Marseille', 
      category: 'Colleague', 
      date: new Date('2023-07-10'),
    },
    { 
      photo: 'https://randomuser.me/api/portraits/men/75.jpg',
      name: 'Pierre Bernard', 
      city: 'Toulouse', 
      category: 'Family', 
      date: new Date('2023-08-05'),
    },
    { 
      photo: 'https://randomuser.me/api/portraits/women/25.jpg',
      name: 'Julie Petit', 
      city: 'Nice', 
      category: 'Friend', 
      date: new Date('2023-09-12'),
    },
    {
      photo: 'https://randomuser.me/api/portraits/women/25.jpg',
      name: 'Camille Petit',
      city: 'Nice',
      category: 'Friend',
      date: new Date('2023-09-18')
    },
    {
      photo: 'https://randomuser.me/api/portraits/men/55.jpg',
      name: 'Nicolas Moreau',
      city: 'Bordeaux',
      category: 'Family',
      date: new Date('2023-10-22')
    },
    {
      photo: 'https://randomuser.me/api/portraits/women/33.jpg',
      name: 'Amélie Laurent',
      city: 'Lille',
      category: 'Colleague',
      date: new Date('2023-11-30')
    },
    {
      photo: 'https://randomuser.me/api/portraits/men/12.jpg',
      name: 'Pierre Garnier',
      city: 'Strasbourg',
      category: 'Business',
      date: new Date('2024-01-15')
    },
    {
      photo: 'https://randomuser.me/api/portraits/women/87.jpg',
      name: 'Juliette Roux',
      city: 'Nantes',
      category: 'Friend',
      date: new Date('2024-02-20')
    },
    {
      photo: 'https://randomuser.me/api/portraits/men/90.jpg',
      name: 'Antoine Fournier',
      city: 'Montpellier',
      category: 'Family',
      date: new Date('2024-03-10')
    },
    {
      photo: 'https://randomuser.me/api/portraits/women/56.jpg',
      name: 'Clara Mercier',
      city: 'Rennes',
      category: 'Colleague',
      date: new Date('2024-04-05')
    },
    {
      photo: 'https://randomuser.me/api/portraits/men/43.jpg',
      name: 'Lucas Lambert',
      city: 'Grenoble',
      category: 'Business',
      date: new Date('2024-05-18')
    },
    {
      photo: 'https://randomuser.me/api/portraits/women/22.jpg',
      name: 'Chloé Girard',
      city: 'Dijon',
      category: 'Friend',
      date: new Date('2024-06-22')
    },
    {
      photo: 'https://randomuser.me/api/portraits/men/67.jpg',
      name: 'Hugo Blanc',
      city: 'Angers',
      category: 'Family',
      date: new Date('2024-07-30')
    },
    {
      photo: 'https://randomuser.me/api/portraits/women/91.jpg',
      name: 'Zoé Chevalier',
      city: 'Clermont-Ferrand',
      category: 'Colleague',
      date: new Date('2024-08-15')
    }
  ];

  dataSource = new MatTableDataSource(this.mockData);

  toggleActiveButton(state: boolean): void {
    this.activeButton = state;
  }
}
