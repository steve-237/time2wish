import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
  selector: 'app-confirm-delete',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, TranslocoPipe],
  templateUrl: './confirm-delete.component.html',
})
export class ConfirmDeleteComponent {
  constructor(private dialogRef: MatDialogRef<ConfirmDeleteComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
