import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { DialogService } from '../../shared/services/dialog/dialog.service';
import { HelpsComponent } from '../helps/helps.component';
import { ConditionsComponent } from '../conditions/conditions.component';
import { ConfidentialityComponent } from '../confidentiality/confidentiality.component';

@Component({
  selector: 'app-footer',
  imports: [MatIconModule, TranslocoModule, DatePipe],
  templateUrl: './footer.component.html',
})  

export class FooterComponent {
  currentDate: Date = new Date();

  private modalComponentMap = {
    help: HelpsComponent,
    conditions: ConditionsComponent,
    confidentiality: ConfidentialityComponent,
  };

  constructor(private dialog: DialogService) {}

  /**
   * Opens a modal dialog displaying the specified component.
   *
   * @param component - The type of modal to open. Can be 'help', 'conditions', or 'confidentiality'.
   * 
   * Looks up the corresponding component class from `modalComponentMap` and opens it in a dialog
   * with a fixed width of 500px using the Angular Material Dialog service.
   */
  public openModal(component: 'help' | 'conditions' | 'confidentiality') {
    const componentClass = this.modalComponentMap[component];
    if (componentClass) {
      this.dialog.open(componentClass);
    }
  }
}
