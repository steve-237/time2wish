import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BirthdayService } from '../../core/services/birthday/birthday.service';
import { DialogService } from '../../shared/services/dialog/dialog.service';
import { BirthdayDetailsComponent } from '../../pages/birthday-details/birthday-details.component';

@Component({
  selector: 'app-birthday-card',
  imports: [
    CommonModule,
    NgClass,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    DatePipe,
  ],
  templateUrl: './birthday-card.component.html',
  styleUrl: './birthday-card.component.css',
})
export class BirthdayCardComponent {
  @Input() item: any;
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() details = new EventEmitter<void>();

  constructor(
    private dialog: DialogService,
    private birthdayService: BirthdayService
  ) {}

  getBirthdayStatus(birthdayDate: Date): {
    text: string;
    icon: string;
    color: string;
  } {
    return this.birthdayService.getBirthdayStatus(birthdayDate);
  }

  calculateAge(birthdayDate: Date) {
    this.birthdayService.calculateAge(birthdayDate);
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
