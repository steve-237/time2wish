import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-information',
  imports: [MatCardModule, MatIconModule, MatExpansionModule, MatListModule],
  templateUrl: './information.component.html',
})
export class InformationComponent {}
