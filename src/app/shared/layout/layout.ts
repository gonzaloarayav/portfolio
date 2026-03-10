import { Component, signal, AfterViewInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
    MatSlideToggleModule,
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
export class Layout implements AfterViewInit {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  isDarkTheme = signal(true);
  currentSection = signal('inicio');
  showBackToTop = signal(false);
  private io?: IntersectionObserver;

  constructor() {
    // Tema oscuro por defecto
    const root = document.documentElement;
    root.classList.add('dark-theme');
    root.classList.remove('light-theme');
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

      const observeSelector = ['.section', '.reveal-up', '.reveal-left', '.reveal-right', '.reveal-fade'].join(',');
      document.querySelectorAll<HTMLElement>(observeSelector).forEach((el) => this.io?.observe(el));
    }

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.max(0, Math.min(100, (y / max) * 100)) : 0;
      document.documentElement.style.setProperty('--scroll-progress', pct + '%');
      this.showBackToTop.set(y > 600);
    });
  }

  toggleTheme(checked: boolean) {
    this.isDarkTheme.set(checked);
    const root = document.documentElement;
    if (checked) {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
  }

  scrollTo(id: string) {
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
