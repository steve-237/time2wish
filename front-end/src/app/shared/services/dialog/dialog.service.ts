import { inject, Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private dialog = inject(MatDialog);

  open<T>(component: Type<T>, config: { width?: string; data?: any } = {}): MatDialogRef<T> {

    const mainContent = document.querySelector('app-root');

    if (mainContent) {
      mainContent.setAttribute('inert', '');
    }

    const dialogRef = this.dialog.open(component, {
      minWidth: config.width || '500px',
      data: config.data || null,
      disableClose: false,
      autoFocus: false,
      restoreFocus: true, 
    });

    dialogRef.afterClosed().subscribe(() => {
      if (mainContent) {
        mainContent.removeAttribute('inert');
      }
    });

    return dialogRef;
  }
}
