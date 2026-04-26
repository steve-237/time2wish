import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { LandingFilterMode } from '../../../../../../landing-page.component';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslocoModule, MatButtonToggleModule],
  templateUrl: './toggle-switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleSwitchComponent {
  @Input({ required: true }) activeMode: LandingFilterMode = 'coming';

  /** Émet le nouveau mode lors du changement */
  @Output() modeChange = new EventEmitter<LandingFilterMode>();

  /**
   * Gère le changement de sélection du groupe
   * @param value Le nouveau mode sélectionné
   */
  onSelectionChange(value: LandingFilterMode): void {
    if (value && value !== this.activeMode) {
      this.modeChange.emit(value);
    }
  }
}
