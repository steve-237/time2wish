import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Mock data
  private users = [
    {
      id: 1,
      email: 'user@example.com',
      password: 'password123',
      name: 'John Doe',
      photo: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: 2,
      email: 'jane@example.com',
      password: 'password123',
      name: 'Jane Smith',
      photo: null
    }
  ];

  private currentUser: any = null;

  constructor() {
    // Vérifier si l'utilisateur est déjà connecté
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  updatedProfile(updatedProfile: any): void {
    this.currentUser = updatedProfile;
    localStorage.setItem('currentUser', JSON.stringify(updatedProfile));
  }

  // Simule un appel API de login
  login(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      // Simule un délai réseau
      setTimeout(() => {
        const user = this.users.find(u => 
          u.email === email && u.password === password
        );

        if (user) {
          this.currentUser = user;
          localStorage.setItem('currentUser', JSON.stringify(user));
          observer.next(user);
          observer.complete();
        } else {
          observer.error('Email ou mot de passe incorrect');
        }
      }, 800); // Délai de 800ms
    });
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }
}
