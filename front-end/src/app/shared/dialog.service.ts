import { inject, Injectable, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private dialog = inject(MatDialog);

  open(component: Type<any>, config: { width?: string; data?: any } = {}) {
    return this.dialog.open(component, {
      width: config.width || '400px',
      data: config.data || null,
      disableClose: false,
      autoFocus: false,
    });
  }
}
