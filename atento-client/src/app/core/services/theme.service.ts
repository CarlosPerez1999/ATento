import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal(false);

  toggleTheme() {
    this.isDarkMode.update(prev => !prev);
    this.applyTheme();
  }

  setLightTheme() {
    this.isDarkMode.set(false);
    this.applyTheme();
  }

  setDarkTheme() {
    this.isDarkMode.set(true);
    this.applyTheme();
  }

  private applyTheme() {
    const element = document.querySelector('html');
    if (this.isDarkMode()) {
        element?.classList.add('dark');
    } else {
        element?.classList.remove('dark');
    }
  }
}
