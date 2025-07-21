import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';

interface User {
  bio: string;
  notifications: boolean;
  id: string;
  email: string;
  password: string;
  name: string;
  photo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  private nextId = 1;

  constructor() {
    // Récupère l'utilisateur depuis le localStorage au démarrage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  register(formData: FormData): Observable<{ success: boolean; message: string; user?: User }> {
    // Vérifie si l'email existe déjà
    const email = formData.get('email') as string;
    if (this.checkEmailExists(email)) {
      return throwError(() => ({
        success: false,
        message: 'Email already exists'
      }));
    }

    const newUser = this.createUserFromFormData(formData);

    return of(newUser).pipe(
      delay(1000), // Simule un temps de réponse réseau
      tap(user => {
        // Ajoute le nouvel utilisateur à la liste
        const currentUsers = this.usersSubject.value;
        this.usersSubject.next([...currentUsers, user]);
        
        // Définit le nouvel utilisateur comme utilisateur courant
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }),
      map(user => ({
        success: true,
        message: 'User registered successfully',
        user
      })),
      catchError(error => {
        return throwError(() => ({
          success: false,
          message: error.message || 'Registration failed'
        }));
      })
    );
  }

  private createUserFromFormData(formData: FormData): User {
    return {
      id: (this.nextId++).toString(),
      email: formData.get('email') as string || '',
      password: formData.get('password') as string || '',
      name: formData.get('name') as string || '',
      photo: formData.get('photo') as string || undefined,
      bio: "",
      notifications: false
    };
  }

  checkEmailExists(email: string): boolean {
    return this.usersSubject.value.some(user => user.email === email);
  }

  updateProfile(updatedUser: User): void {
    // Met à jour l'utilisateur dans la liste
    const users = this.usersSubject.value.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    );
    this.usersSubject.next(users);
    
    // Met à jour l'utilisateur courant si c'est le même
    if (this.currentUserSubject.value?.id === updatedUser.id) {
      this.currentUserSubject.next(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  }

  login(email: string, password: string): Observable<User> {
    const user = this.usersSubject.value.find(u => 
      u.email === email && u.password === password
    );

    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return of(user).pipe(delay(800)); // Simule un délai réseau
    } else {
      return throwError(() => new Error('Email ou mot de passe incorrect'));
    }
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}