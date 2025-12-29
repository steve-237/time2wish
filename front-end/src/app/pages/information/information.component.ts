import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-information',
  imports: [MatCardModule, MatIconModule, MatExpansionModule, MatListModule, TranslocoModule],
  templateUrl: './information.component.html',
})
export class InformationComponent {}
