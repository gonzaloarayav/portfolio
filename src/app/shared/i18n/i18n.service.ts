import { Injectable, signal } from '@angular/core';
import { Lang, translations } from './translations';

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>('es');
  private readonly storageKey = 'lang';

  constructor() {
    const stored = this.safeGetStoredLang();
    const detected = this.detectLang();
    this.setLang(stored ?? detected);
  }

  setLang(lang: Lang) {
    this.lang.set(lang);
    this.safeSetStoredLang(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }

  toggleLang() {
    this.setLang(this.lang() === 'es' ? 'en' : 'es');
  }

  t(key: string, params?: Record<string, unknown>) {
    const dict = translations[this.lang()];
    const template = dict[key] ?? key;
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (_m, name: string) => {
      const value = params[name];
      return value === undefined || value === null ? '' : String(value);
    });
  }

  private detectLang(): Lang {
    if (typeof navigator === 'undefined') return 'es';
    const raw = navigator.language?.toLowerCase() ?? '';
    return raw.startsWith('en') ? 'en' : 'es';
  }

  private safeGetStoredLang(): Lang | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw === 'es' || raw === 'en' ? raw : null;
    } catch {
      return null;
    }
  }

  private safeSetStoredLang(lang: Lang) {
    try {
      localStorage.setItem(this.storageKey, lang);
    } catch {
    }
  }
}

