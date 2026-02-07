import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, delay, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../models/apiResponse.model';
import { AuthResponse } from '../../../models/authResponse.model';
import { LoginRequest } from '../../../models/loginRequest.model';
import { RegisterRequest } from '../../../models/registerRequest.model';
import { UserProfile } from '../../../models/user.model';
import { FAKE_USERS } from './auth.mock-data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Functional injections
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // State management with Signals
  private readonly _currentUser = signal<UserProfile | null>(this.getInitialUser());
  readonly currentUser = this._currentUser.asReadonly();

  // Reactive authentication status
  readonly isAuthenticated = computed(() => !!this._currentUser());

  // Storage keys & API URL
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly USER_KEY = 'user';
  private readonly apiUrl = environment.apiUrl ?? 'http://localhost:9000/api';

  // Mock settings
  private readonly useMockApi = signal(false);
  private mockUsers: UserProfile[] = [...FAKE_USERS];
  private nextUserId = 3;

  /**
   * Update user profile and synchronize state
   * @param userId User ID string
   * @param userData Partial profile data
   */
  updateUserProfile(userId: string, userData: Partial<UserProfile>): Observable<ApiResponse<UserProfile>> {
    // Mock Implementation
    if (this.useMockApi()) {
      const current = this._currentUser();
      const updated = { ...current, ...userData } as UserProfile;
      return of({ success: true, data: updated, message: 'Profile updated (Mock)' }).pipe(
        delay(1000),
        tap(res => {
          if (res.data) this.setCurrentUser(res.data);
        })
      );
    }

    // Real API implementation
    return this.http.put<ApiResponse<UserProfile>>(`${this.apiUrl}/users/${userId}`, userData).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setCurrentUser(response.data);
        }
      })
    );
  }

  /**
   * Manually update the current user signal and local storage
   */
  setCurrentUser(user: UserProfile): void {
    this._currentUser.set(user);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * User login flow
   */
  login(loginData: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    if (this.useMockApi()) return this.mockLogin(loginData);

    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, loginData, { withCredentials: true }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setSession(response.data.user, response.token);
        }
      })
    );
  }

  /**
   * Register a new user
   */
  register(registerData: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    if (this.useMockApi()) return this.mockRegister(registerData);

    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, registerData).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setSession(response.data.user, response.token);
        }
      })
    );
  }

  /**
   * User logout and session clearing
   */
  logout(): Observable<ApiResponse<void>> {
    if (this.useMockApi()) return this.mockLogout();

    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap((response) => {
        if (response.success) {
          this.clearSession();
        }
      })
    );
  }

  /**
   * Request password reset link (Step 1)
   */
  requestPasswordReset(email: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/forgot-password`, { email });
  }

  /**
   * Set new password with token (Step 2)
   */
  resetPassword(token: string, newPassword: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/reset-password`, { token, newPassword });
  }

  // --- Session Helpers ---

  private setSession(user: UserProfile, token?: string): void {
    this.setCurrentUser(user);
    if (token) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    }
  }

  private clearSession(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private getInitialUser(): UserProfile | null {
    const savedUser = localStorage.getItem(this.USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  // --- Mock Implementations ---

  private mockLogin(loginData: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    const user = this.mockUsers.find(u => u.email === loginData.email && u.passwordHash === this.simpleHash(loginData.password));
    if (!user) return of({ success: false, message: 'Incorrect credentials' }).pipe(delay(1000));

    const authResponse: AuthResponse = { user, token: this.generateMockToken(user.id) };
    return of({ success: true, message: 'Login successful', data: authResponse }).pipe(
      delay(800),
      tap(() => this.setSession(user, authResponse.token))
    );
  }

  private mockRegister(data: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    const newUser: UserProfile = {
      id: (this.nextUserId++).toString(),
      fullName: data.fullName,
      email: data.email,
      passwordHash: this.simpleHash(data.password),
      status: 'active',
      createdAt: new Date(),
    } as UserProfile;

    this.mockUsers.push(newUser);
    return of({ success: true, message: 'Success', data: { user: newUser, token: 'token' } }).pipe(
      delay(1000),
      tap(() => this.setSession(newUser))
    );
  }

  private mockLogout(): Observable<ApiResponse<void>> {
    return of({ success: true, message: 'Logged out' }).pipe(delay(500), tap(() => this.clearSession()));
  }

  private simpleHash(password: string): string {
    return btoa(password).substring(0, 8);
  }

  private generateMockToken(userId: string): string {
    return `mock_token_${userId}_${Date.now()}`;
  }

  setUseMockApi(useMock: boolean): void {
    this.useMockApi.set(useMock);
  }
}