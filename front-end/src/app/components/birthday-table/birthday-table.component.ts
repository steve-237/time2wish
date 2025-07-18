import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BirthdayService } from '../../core/services/birthday/birthday.service';
import { TranslocoModule } from '@jsverse/transloco';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { BirthdayDetailsComponent } from '../../pages/birthday-details/birthday-details.component';
import { DialogService } from '../../shared/services/dialog/dialog.service';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-birthday-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TranslocoModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './birthday-table.component.html',
  styleUrl: './birthday-table.component.css',
})
export class BirthdayTableComponent {
  
  @Input() birthdays: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  displayedColumns: string[] = [
    'photo',
    'name',
    'city',
    'category',
    'date',
    'age',
    'status',
    'action',
  ];

  constructor(private dialog: DialogService, private birthdayService: BirthdayService) {}

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  dataSource = new MatTableDataSource<any>();
  pageSize = 8;
  pageSizeOptions: number[] = [8, 12, 25, 100];
  
  ngOnChanges() {
    this.dataSource.data = this.birthdays;
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
     this.dataSource.sort = this.sort;
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

     this.dataSource.sort = this.sort;
  
  // Configuration du tri personnalisé pour certaines colonnes
  this.dataSource.sortingDataAccessor = (item, property) => {
    switch (property) {
      case 'date': 
        return new Date(item.date).getTime();
      case 'age':
        return this.calculateAge(item.date);
      case 'status':
        return this.getBirthdayStatus(item.date).text;
      default:
        return item[property];
    }
  };
  }

  getBirthdayStatus(birthdayDate: Date): {
    text: string;
    icon: string;
    color: string;
  } {
    return this.birthdayService.getBirthdayStatus(birthdayDate);
  }

  calculateAge(birthdayDate: Date): number {
    return this.birthdayService.calculateAge(birthdayDate);
  }

  openBirthdayDetails(birthday: any) {
    this.dialog.open(BirthdayDetailsComponent, {
          width: '600px',
          data: birthday,
        });
  }

  deleteBirthday(id: number) {
    this.delete.emit(id);
  }
}
