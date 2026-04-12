import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { ConditionsComponent } from '../conditions/conditions.component';
import { ConfidentialityComponent } from '../confidentiality/confidentiality.component';
import { HelpsComponent } from '../helps/helps.component';
import { DialogService } from '../../shared/services/dialog/dialog.service';

@Component({
  selector: 'app-footer',
  imports: [MatIconModule, TranslocoModule, DatePipe],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private readonly dialog = inject(DialogService);

  readonly currentDate: Date = new Date();

  private readonly modalComponentMap = {
    help: HelpsComponent,
    conditions: ConditionsComponent,
    confidentiality: ConfidentialityComponent,
  };

  openModal(component: 'help' | 'conditions' | 'confidentiality'): void {
    const componentClass = this.modalComponentMap[component];
    if (componentClass) {
      this.dialog.open(componentClass);
    }
  }
}
