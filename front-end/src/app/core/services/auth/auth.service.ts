import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { UserProfile } from '../../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../models/apiResponse.model';
import { AuthResponse } from '../../../models/authResponse.model';
import { LoginRequest } from '../../../models/loginRequest.model';
import { RegisterRequest } from '../../../models/registerRequest.model';

// Données fake pour la simulation
const FAKE_USERS: UserProfile[] = [
  {
    id: '1',
    fullName: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    passwordHash: 'JD123456', // En réalité, serait hashé
    bio: 'Développeur passionné',
    notificationsEnabled: true,
    birthdays: [
      {
        id: 1,
        name: 'Marie Martin',
        date: new Date('1990-05-15'),
        city: 'Paris',
        category: 'friend',
        photo: 'assets/avatars/avatar1.jpg',
        notes: 'N\'aime pas le chocolat',
        userId: '1',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 2,
        name: 'Pierre Durand',
        date: new Date('1985-08-22'),
        city: 'Lyon',
        category: 'family',
        photo: 'assets/avatars/avatar2.jpg',
        notes: 'Adore les gâteaux au fromage',
        userId: '1',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      }
    ],
    theme: 'light',
    language: 'fr',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20'),
    lastLoginAt: new Date('2024-01-20'),
    status: 'active',
    profilePicture: 'assets/avatars/user1.jpg'
  },
  {
    id: '2',
    fullName: 'Sophie Lambert',
    email: 'sophie.lambert@email.com',
    passwordHash: 'SL789012',
    bio: 'Designer créative',
    notificationsEnabled: false,
    birthdays: [
      {
        id: 3,
        name: 'Thomas Moreau',
        date: new Date('1992-12-03'),
        city: 'Marseille',
        category: 'colleague',
        photo: 'assets/avatars/avatar3.jpg',
        notes: 'Préfère les cadeaux expérientiels',
        userId: '2',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08')
      }
    ],
    theme: 'dark',
    language: 'en',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-18'),
    lastLoginAt: new Date('2024-01-18'),
    status: 'active',
    profilePicture: 'assets/avatars/user2.jpg'
  }
];

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  
 private users: UserProfile[] = [...FAKE_USERS];
  private nextUserId = 3;

  private useMockApi = true; // Basculer à false pour utiliser le vrai backend
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  /**
   * Inscription d'un nouvel utilisateur
   */
  register(registerData: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    if (this.useMockApi) {
      return this.mockRegister(registerData);
    }
    
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, registerData)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  /**
   * Simulation d'inscription
   */
  private mockRegister(registerData: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    // Vérifie si l'email existe déjà
    const existingUser = this.users.find(user => user.email === registerData.email);
    if (existingUser) {
      return of({
        success: false,
        message: 'Un compte avec cet email existe déjà',
        errors: ['EMAIL_ALREADY_EXISTS']
      }).pipe(delay(1000));
    }

    // Création du nouvel utilisateur
    const newUser: UserProfile = {
      id: (this.nextUserId++).toString(),
      fullName: registerData.fullName,
      email: registerData.email,
      passwordHash: this.simpleHash(registerData.password),
      bio: '',
      notificationsEnabled: registerData.notificationsEnabled ?? true,
      birthdays: [],
      theme: registerData.theme || 'light',
      language: registerData.language || 'fr',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    };

    this.users.push(newUser);

    const authResponse: AuthResponse = {
      user: newUser,
      token: this.generateMockToken(newUser.id)
    };

    return of({
      success: true,
      message: 'Votre compte a été créé avec succès !',
      data: authResponse
    }).pipe(
      delay(1500),
      tap(() => {
        this.currentUserSubject.next(newUser);
      })
    );
  }

  /**
   * Connexion de l'utilisateur
   */
  login(loginData: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    if (this.useMockApi) {
      return this.mockLogin(loginData);
    }
    
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  /**
   * Simulation de connexion
   */
  private mockLogin(loginData: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    const user = this.users.find(u => 
      u.email === loginData.email && 
      u.passwordHash === this.simpleHash(loginData.password)
    );

    if (!user) {
      return of({
        success: false,
        message: 'Email ou mot de passe incorrect',
        errors: ['INVALID_CREDENTIALS']
      }).pipe(delay(1000));
    }

    // Met à jour la date de dernière connexion
    user.lastLoginAt = new Date();
    const userIndex = this.users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      this.users[userIndex] = user;
    }

    const authResponse: AuthResponse = {
      user: user,
      token: this.generateMockToken(user.id)
    };

    return of({
      success: true,
      message: 'Connexion réussie !',
      data: authResponse
    }).pipe(
      delay(1200),
      tap(() => {
        this.currentUserSubject.next(user);
      })
    );
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): Observable<ApiResponse<void>> {
    if (this.useMockApi) {
      return this.mockLogout();
    }
    
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(response => {
          if (response.success) {
            this.currentUserSubject.next(null);
          }
        })
      );
  }

  private mockLogout(): Observable<ApiResponse<void>> {
    return of({
      success: true,
      message: 'Déconnexion réussie'
    }).pipe(
      delay(500),
      tap(() => {
        this.currentUserSubject.next(null);
      })
    );
  }

  /**
   * Récupération du profil utilisateur courant
   */
  getCurrentUser(): Observable<ApiResponse<UserProfile>> {
    if (this.useMockApi) {
      return this.mockGetCurrentUser();
    }
    
    return this.http.get<ApiResponse<UserProfile>>(`${this.apiUrl}/me`)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data);
          }
        })
      );
  }

  private mockGetCurrentUser(): Observable<ApiResponse<UserProfile>> {
    const currentUser = this.currentUserSubject.value;
    
    if (!currentUser) {
      return of({
        success: false,
        message: 'Utilisateur non connecté',
        errors: ['NOT_AUTHENTICATED']
      }).pipe(delay(800));
    }

    // Récupère les données à jour de l'utilisateur
    const updatedUser = this.users.find(u => u.id === currentUser.id);
    
    if (!updatedUser) {
      return of({
        success: false,
        message: 'Utilisateur non trouvé',
        errors: ['USER_NOT_FOUND']
      }).pipe(delay(800));
    }

    return of({
      success: true,
      message: 'Profil utilisateur récupéré',
      data: updatedUser
    }).pipe(
      delay(600),
      tap(() => {
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  /**
   * Mise à jour du profil utilisateur
   */
  updateUserProfile(userData: Partial<UserProfile>): Observable<ApiResponse<UserProfile>> {
    if (this.useMockApi) {
      return this.mockUpdateUserProfile(userData);
    }
    
    return this.http.put<ApiResponse<UserProfile>>(`${this.apiUrl}/profile`, userData)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data);
          }
        })
      );
  }

  private mockUpdateUserProfile(userData: Partial<UserProfile>): Observable<ApiResponse<UserProfile>> {
    const currentUser = this.currentUserSubject.value;
    
    if (!currentUser) {
      return of({
        success: false,
        message: 'Utilisateur non connecté',
        errors: ['NOT_AUTHENTICATED']
      }).pipe(delay(800));
    }

    const userIndex = this.users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) {
      return of({
        success: false,
        message: 'Utilisateur non trouvé',
        errors: ['USER_NOT_FOUND']
      }).pipe(delay(800));
    }

    // Met à jour l'utilisateur
    const updatedUser: UserProfile = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date()
    };

    this.users[userIndex] = updatedUser;

    return of({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: updatedUser
    }).pipe(
      delay(1000),
      tap(() => {
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  /**
   * Demande de réinitialisation de mot de passe
   */
  forgotPassword(email: string): Observable<ApiResponse<void>> {
    if (this.useMockApi) {
      return this.mockForgotPassword(email);
    }
    
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/forgot-password`, { email });
  }

  private mockForgotPassword(email: string): Observable<ApiResponse<void>> {
    const userExists = this.users.some(u => u.email === email);
    
    if (!userExists) {
      return of({
        success: false,
        message: 'Aucun compte trouvé avec cet email',
        errors: ['EMAIL_NOT_FOUND']
      }).pipe(delay(1000));
    }

    return of({
      success: true,
      message: 'Un email de réinitialisation a été envoyé'
    }).pipe(delay(1500));
  }

  /**
   * Vérification si l'utilisateur est connecté
   */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Récupération de l'utilisateur courant (synchrone)
   */
  getCurrentUserValue(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  /**
   * Méthodes utilitaires pour la simulation
   */
  private simpleHash(password: string): string {
    // Simulation simple de hash - en réalité utiliser bcrypt ou autre
    return btoa(password).substring(0, 8);
  }

  private generateMockToken(userId: string): string {
    // Génère un token mock simple
    return `mock_token_${userId}_${Date.now()}`;
  }

  /**
   * Méthode de développement pour basculer entre mock et vrai API
   */
  setUseMockApi(useMock: boolean): void {
    this.useMockApi = useMock;
  }

  /**
   * Méthode de développement pour réinitialiser les données mock
   */
  resetMockData(): void {
    this.users = [...FAKE_USERS];
    this.nextUserId = 3;
    this.currentUserSubject.next(null);
  }

  /**
   * Méthode de développement pour obtenir tous les utilisateurs (debug)
   */
  getMockUsers(): UserProfile[] {
    return [...this.users];
  }
}