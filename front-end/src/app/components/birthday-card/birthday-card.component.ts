import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BirthdayService } from '../../core/services/birthday/birthday.service';

@Component({
  selector: 'app-birthday-card',
   imports: [
    CommonModule,
    NgClass,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    DatePipe
  ],
  templateUrl: './birthday-card.component.html',
  styleUrl: './birthday-card.component.css',
})
export class BirthdayCardComponent {
openBirthdayDetails(arg0: any) {
throw new Error('Method not implemented.');
}
deleteBirthday(arg0: any) {
throw new Error('Method not implemented.');
}
  @Input() item: any;
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() details = new EventEmitter<void>();

  constructor(private birthdayService: BirthdayService) {}

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
}
