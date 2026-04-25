import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

import { LandingFilterMode } from '../../../../../../landing-page.component';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslocoModule],
  templateUrl: './toggle-switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleSwitchComponent {
  @Input({ required: true }) activeMode!: LandingFilterMode;

  @Output() modeChange = new EventEmitter<LandingFilterMode>();

  select(mode: LandingFilterMode): void {
    if (this.activeMode !== mode) {
      this.modeChange.emit(mode);
    }
  }
}
