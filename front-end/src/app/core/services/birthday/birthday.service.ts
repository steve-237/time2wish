import { NotificationService } from './../../../shared/services/notification/notification.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Birthday } from '../../../models/birthday.model';
import { HttpClient } from '@angular/common/http';
import { TranslocoService } from '@jsverse/transloco';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class BirthdayService {
  private _birthdays = new BehaviorSubject<Birthday[]>([]);
  readonly birthdays$ = this._birthdays.asObservable();

  // private apiUrl = '/mock/birthdays.json';  Remplacer par une vraie API si dispo

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private translocoService: TranslocoService
  ) {}

  /* fetchBirthdays(): void {
    this.http.get<Birthday[]>(this.apiUrl).subscribe(data => {
      this._birthdays.next(data);
    });
  } */

  /**
   * Charge les birthdays de l'utilisateur courant
   */
  fetchBirthdays(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        console.log('fetching user... ', user);
        this._birthdays.next(user.birthdays || []);
      } else {
        this._birthdays.next([]);
      }
    });
  }

  getBirthdayById(id: number): Observable<Birthday | undefined> {
    return this.birthdays$.pipe(map((list) => list.find((b) => b.id === id)));
  }

  addBirthday(birthday: Birthday): void {
    const current = this._birthdays.value;
    const newBirthday = {
      ...birthday,
      id: this.generateId(),
      birthDate: new Date(birthday.date), // Ca doit etre une date
    };
    this._birthdays.next([newBirthday, ...current]);
    // l'appel HTTP ici:
    // this.http.post('/api/birthdays', newBirthday).subscribe(...);
  }

  updateBirthday(updated: Birthday): Observable<Birthday> {
    return new Observable<Birthday>((subscriber) => {
      try {
        const current = this._birthdays.value;
        const index = current.findIndex((b) => b.id === updated.id);

        if (index === -1) {
          throw new Error('Birthday not found');
        }

        const updatedBirthday = {
          ...updated,
          birthDate: new Date(updated.date),
        };

        const updatedList = [...current];
        updatedList[index] = updatedBirthday;

        this._birthdays.next(updatedList);

        subscriber.next(updatedBirthday);
        subscriber.complete();

        // TODO: Remplacer par un vrai appel API plus tard
        // return this.http.put<Birthday>(`${this.apiUrl}/${updated.id}`, updated);
      } catch (error) {
        subscriber.error(error);
      }
    });
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
