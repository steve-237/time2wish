import { Component, OnInit } from '@angular/core';
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
import { VersionService } from '../../shared/services/version/version.service';

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
})
export class AsideNavBarComponent implements OnInit {
onStatistics() {
throw new Error('Method not implemented.');
}
  expanded = false;
  version = '';

  constructor(private dialog: DialogService, public authService: AuthService, private versionService: VersionService) {}

  ngOnInit(): void {
    this.version = this.versionService.version;
  }

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
