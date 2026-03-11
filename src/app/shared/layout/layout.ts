import { Component, signal, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Home } from '../../pages/home/home';
import { Skills } from '../../pages/skills/skills';
import { Resume } from '../../pages/resume/resume';
import { Projects } from '../../pages/projects/projects';
import { Experience } from '../../pages/experience/experience';
import { Contact } from '../../pages/contact/contact';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    Home,
    Skills,
    Resume,
    Projects,
    Experience,
    Contact,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements AfterViewInit, OnDestroy {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  isDarkTheme = signal(true);
  currentSection = signal('inicio');
  showBackToTop = signal(false);
  private io?: IntersectionObserver;
  private mo?: MutationObserver;
  private observed = new WeakSet<Element>();
  private readonly themeStorageKey = 'theme';
  private readonly observeSelector = ['.section', '.reveal-up', '.reveal-left', '.reveal-right', '.reveal-fade'].join(',');
  private onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.max(0, Math.min(100, (y / max) * 100)) : 0;
    document.documentElement.style.setProperty('--scroll-progress', pct + '%');
    this.showBackToTop.set(y > 600);
  };

  constructor() {
    const stored = this.safeGetTheme();
    const prefersDark =
      typeof window !== 'undefined' &&
      typeof window.matchMedia !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialIsDark = stored ? stored === 'dark' : prefersDark;
    this.applyTheme(initialIsDark);
  }

  ngAfterViewInit() {
    if (typeof IntersectionObserver !== 'undefined') {
      this.io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target as HTMLElement;
            if (entry.isIntersecting) {
              el.classList.add('visible');
              const id = el.id;
              if (id) {
                this.currentSection.set(id);
              }
            }
          });
        },
        { threshold: 0.25 }
      );

      this.observeAll();

      if (typeof MutationObserver !== 'undefined') {
        this.mo = new MutationObserver(() => this.observeAll());
        if (document.body) {
          this.mo.observe(document.body, { subtree: true, childList: true });
        }
      }
    }

    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onScroll();
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll);
    this.mo?.disconnect();
    this.io?.disconnect();
  }

  toggleTheme() {
    this.applyTheme(!this.isDarkTheme());
  }

  currentYear() {
    return new Date().getFullYear();
  }

  private applyTheme(isDark: boolean) {
    this.isDarkTheme.set(isDark);
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
    this.safeSetTheme(isDark ? 'dark' : 'light');
  }

  private safeGetTheme() {
    try {
      const raw = localStorage.getItem(this.themeStorageKey);
      return raw === 'dark' || raw === 'light' ? raw : null;
    } catch {
      return null;
    }
  }

  private safeSetTheme(theme: 'dark' | 'light') {
    try {
      localStorage.setItem(this.themeStorageKey, theme);
    } catch {
    }
  }

  private observeAll() {
    if (!this.io) return;
    document.querySelectorAll<HTMLElement>(this.observeSelector).forEach((el) => {
      if (this.observed.has(el)) return;
      this.observed.add(el);
      this.io?.observe(el);
    });
  }

  scrollTo(id: string) {
    if (id === 'inicio') {
      this.backToTop();
      this.currentSection.set(id);
      if (this.sidenav?.opened) {
        this.sidenav.close();
      }
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const toolbar = document.querySelector('.app-toolbar') as HTMLElement | null;
    const offset = toolbar?.clientHeight ?? 0;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    this.currentSection.set(id);
    if (this.sidenav?.opened) {
      this.sidenav.close();
    }
  }

  backToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
