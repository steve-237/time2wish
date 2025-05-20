import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Birthday } from '../../../models/birthday.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BirthdayService {
  private _birthdays = new BehaviorSubject<Birthday[]>([]);
  readonly birthdays$ = this._birthdays.asObservable();

  private apiUrl = '/mock/birthdays.json'; // Remplacer par une vraie API si dispo

  constructor(private http: HttpClient) {}

  fetchBirthdays(): void {
    this.http.get<Birthday[]>(this.apiUrl).subscribe(data => {
      this._birthdays.next(data);
    });
  }

  getBirthdayById(id: number): Observable<Birthday | undefined> {
    return this.birthdays$.pipe(map(list => list.find(b => b.id === id)));
  }

  addBirthday(birthday: Birthday): void {
    const current = this._birthdays.value;
    this._birthdays.next([...current, { ...birthday, id: this.generateId() }]);
  }

  updateBirthday(updated: Birthday): void {
    const current = this._birthdays.value.map(b =>
      b.id === updated.id ? updated : b
    );
    this._birthdays.next(current);
  }

  deleteBirthday(id: number): void {
    const current = this._birthdays.value.filter(b => b.id !== id);
    this._birthdays.next(current);
  }

  private generateId(): number {
    const current = this._birthdays.value;
    return current.length ? Math.max(...current.map(b => b.id)) + 1 : 1;
  }
}
