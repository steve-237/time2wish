import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
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

  activeButton: boolean = false;
  displayedColumns: string[] = ['photo', 'name', 'city', 'category', 'date', 'action'];

  currentDate: Date = new Date();
  expanded = false;

  ngOnInit() {
    setInterval(() => {
      this.currentDate = new Date();
    }, 60000);
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
  ];

  dataSource = new MatTableDataSource(this.mockData);

  toggleActiveButton(state: boolean): void {
    this.activeButton = state;
  }
}
