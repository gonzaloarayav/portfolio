import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme = signal<'light' | 'dark' | 'retro'>('dark');

  private readonly themeStorageKey = 'theme';

  constructor() {
    const stored = this.safeGetTheme();
    const prefersDark =
      typeof window !== 'undefined' &&
      typeof window.matchMedia !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = stored ? stored : (prefersDark ? 'dark' : 'light');
    this.setTheme(initialTheme as 'light' | 'dark' | 'retro');
  }

  cycleTheme() {
    const current = this.theme();
    if (current === 'dark') {
      this.setTheme('light');
    } else {
      this.setTheme('dark');
    }
  }

  setTheme(newTheme: 'light' | 'dark' | 'retro') {
    this.theme.set(newTheme);
    const root = document.documentElement;
    root.classList.remove('light-theme', 'dark-theme', 'retro-theme');
    root.classList.add(`${newTheme}-theme`);
    this.safeSetTheme(newTheme);
  }

  private safeGetTheme() {
    try {
      const raw = localStorage.getItem(this.themeStorageKey);
      return raw === 'dark' || raw === 'light' || raw === 'retro' ? raw : null;
    } catch {
      return null;
    }
  }

  private safeSetTheme(theme: 'light' | 'dark' | 'retro') {
    try {
      localStorage.setItem(this.themeStorageKey, theme);
    } catch {
    }
  }
}
