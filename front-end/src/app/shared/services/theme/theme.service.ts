import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';
  readonly isDarkTheme = signal(false);

  constructor() {
    this.initializeTheme();
  }

  toggleTheme(): void {
    const next = !this.isDarkTheme();
    this.applyTheme(next);
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    this.applyTheme(useDark);
  }

  private applyTheme(isDark: boolean): void {
    this.isDarkTheme.set(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
  }
}
