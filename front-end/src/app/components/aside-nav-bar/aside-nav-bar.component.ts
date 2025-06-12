import { Component } from '@angular/core';
import { SettingComponent } from '../../pages/setting/setting.component';
import { NewBirthdayComponent } from '../../pages/new-birthday/new-birthday.component';
import { DialogService } from '../../shared/services/dialog/dialog.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-aside-nav-bar',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    FormsModule,
    MatTooltipModule,
    TranslocoModule,
  ],
  templateUrl: './aside-nav-bar.component.html',
  styleUrl: './aside-nav-bar.component.css',
})
export class AsideNavBarComponent {
  expanded = false;

  constructor(private dialog: DialogService, public authService: AuthService) {}

  onSetting() {
    this.dialog.open(SettingComponent);
  }

  onAddBirthday() {
    this.dialog.open(NewBirthdayComponent);
  }

  toggleSidebar() {
    this.expanded = !this.expanded;
  }
}
