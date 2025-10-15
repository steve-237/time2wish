import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Birthday } from '../../../models/birthday.model';
import { HttpClient } from '@angular/common/http';
import { TranslocoService } from '@jsverse/transloco';
import {catchError, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class BirthdayService {
  private _birthdays = new BehaviorSubject<Birthday[]>([]);
  readonly birthdays$ = this._birthdays.asObservable();

  private apiUrl = 'http://localhost:9000/';  //Remplacer par une vraie API si dispo

  constructor(
    private http: HttpClient,
    private translocoService: TranslocoService
  ) {}

  fetchBirthdays(): void {
    this.http.get<Birthday[]>(this.apiUrl +'birthdayTable').subscribe(data => {
      this._birthdays.next(data);
      console.log(data);
    });

  }

  getBirthdayById(id: number): Observable<Birthday | undefined> {
    return this.birthdays$.pipe(map((list) => list.find((b) => b.id === id)));
  }

  addBirthday(birthday: Birthday): void {
    this.http.post<Birthday>(this.apiUrl + 'birthdayTable', birthday).subscribe({
      next: (savedBirthday) => {
        // On récupère la liste actuelle
        const current = this._birthdays.value;

        // Ajoute le nouvel anniversaire retourné par le backend
        this._birthdays.next([savedBirthday, ...current]);

        console.log('Birthday saved successfully:', savedBirthday);
      },
      error: (error) => { console.error('Error saving birthday:', error);}
    });
  }

  updateBirthday(updated: Birthday): Observable<Birthday> {
    return this.http.put<Birthday>(this.apiUrl+`/birthday/${updated.id}`, updated).pipe(
      tap(updateBirthday => {
        const current = this._birthdays.value;

        const index = current.findIndex((b) => b.id === updateBirthday.id);

        if (index === -1) {
          throw new Error('Birthday not found');
        }

        const updatedList = [...current];
        updatedList[index] = updateBirthday;
        this._birthdays.next(updatedList);

      }),
      catchError((error) => {
        console.error('Erreur lors de la mise à jour:', error);
        throw error;
      })
    );
  }

  deleteBirthday(id: number): void {
    const current = this._birthdays.value.filter((b) => b.id !== id);
    this._birthdays.next(current);
  }

  private generateId(): number {
    const current = this._birthdays.value;
    return current.length ? Math.max(...current.map((b) => b.id)) + 1 : 1;
  }

  getBirthdayStatus(birthdayDate: Date): {
    text: string;
    icon: string;
    color: string;
  } {
    const today = new Date();
    const date = new Date(birthdayDate);
    date.setFullYear(today.getFullYear());

    const diffDays = Math.ceil(
      (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays > 0) {
      return {
        text: this.translocoService.translate('status.coming', {
          count: diffDays,
        }),
        icon: 'event_upcoming',
        color: 'text-green-500',
      };
    } else if (diffDays === 0) {
      return {
        text: this.translocoService.translate('status.today'),
        icon: 'celebration',
        color: 'text-blue-500',
      };
    } else {
      return {
        text: this.translocoService.translate('status.passed'),
        icon: 'event_busy',
        color: 'text-gray-400',
      };
    }
  }

  calculateAge(birthDate: Date): number {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }

    return age;
  }
}
