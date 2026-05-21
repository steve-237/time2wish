import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-date-time-display',
  standalone: true,
  imports: [DatePipe, MatIconModule],
  templateUrl: './date-time-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateTimeDisplayComponent {
  @Input({ required: true }) currentDate!: Date;
}
