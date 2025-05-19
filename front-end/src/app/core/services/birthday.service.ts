import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Birthday } from '../../models/birthday.model';

@Injectable({
  providedIn: 'root'
})
export class BirthdayService {
  private _birthdays = new BehaviorSubject<Birthday[]>([]);

  get birthdays$() {
    return this._birthdays.asObservable();
  }

  setBirthdays(birthdays: Birthday[]) {
    this._birthdays.next(birthdays);
  }

  delete(id: number) {
    const current = this._birthdays.value;
    this._birthdays.next(current.filter(b => b.id !== id));
  }
}
