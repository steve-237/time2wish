import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private storageKey = 'app-theme'; // Key to store user preference theme in localStorage
  private readonly htmlDocument = document.documentElement; // get <html></html> tag

  constructor() {
    this.loadTheme();
  }

  toggleTheme(isDark : boolean): void {
     isDark = this.htmlDocument.classList.toggle('dark'); // return true if class 'dark' exist.
    localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light'); // save in storageKey the app theme preference.
  }

  setTheme(theme: 'light' | 'dark'): void {
    if (theme === 'dark') {
      this.htmlDocument.classList.add('dark'); //add 'dark' class to <html></html>
    } else {
      this.htmlDocument.classList.remove('dark');
    }
    localStorage.setItem(this.storageKey, theme);
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem(this.storageKey);

    if (savedTheme) {
      this.setTheme(savedTheme as 'light' | 'dark'); // set the saved theme if a preference already exist in localStorage.
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; // check if the system preferences of the user is dark or not.
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
  }
}
