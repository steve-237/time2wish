import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-birthday-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    TranslocoModule,
    MatIconModule,
  ],
  templateUrl: './birthday-form.component.html',
  styleUrl: './birthday-form.component.css',
})
export class BirthdayFormComponent {
  birthdayForm: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BirthdayFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdit = data.isEdit || false;
    this.birthdayForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      date: [null, Validators.required],
      city: [''],
      category: [''],
      photo: [''],
      notes: [''],
    });
  }

  ngOnInit(): void {
    this.birthdayForm = this.fb.group({
      id: [this.data.birthday?.id || null],
      name: [this.data.birthday?.name || '', Validators.required],
      date: [
        this.data.birthday?.date ? new Date(this.data.birthday.date) : null,
        Validators.required,
      ],
      city: [this.data.birthday?.city || ''],
      category: [this.data.birthday?.category || ''],
      photo: [this.data.birthday?.photo || ''],
      notes: [this.data.birthday?.notes || ''],
    });
  }

  onSubmit(): void {
    if (this.birthdayForm?.valid) {
      this.dialogRef.close(this.birthdayForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
