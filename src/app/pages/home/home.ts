import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit, OnDestroy {
  @ViewChild('heroName', { static: true }) heroNameEl?: ElementRef<HTMLElement>;

  private io?: IntersectionObserver;
  private typingTimer?: number;
  private fullName = '';
  private inView = false;

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    const el = this.heroNameEl?.nativeElement;
    if (!el) return;

    this.fullName = (el.textContent ?? '').trim();
    if (!this.fullName) return;

    if (typeof IntersectionObserver === 'undefined') {
      this.startTyping();
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          if (entry.isIntersecting) {
            if (!this.inView) {
              this.inView = true;
              this.startTyping();
            }
          } else {
            this.inView = false;
            this.stopTyping();
          }
        },
        { threshold: 0.75 }
      );
      this.io.observe(el);
    });
  }

  ngOnDestroy() {
    this.stopTyping();
    this.io?.disconnect();
  }

  private startTyping() {
    const el = this.heroNameEl?.nativeElement;
    if (!el) return;
    if (!this.fullName) return;

    this.stopTyping();
    el.classList.add('is-typing');
    el.textContent = '';

    let i = 0;
    this.typingTimer = window.setInterval(() => {
      i += 1;
      el.textContent = this.fullName.slice(0, i);
      if (i >= this.fullName.length) {
        this.stopTyping();
      }
    }, 55);
  }

  private stopTyping() {
    const el = this.heroNameEl?.nativeElement;
    if (this.typingTimer) {
      window.clearInterval(this.typingTimer);
      this.typingTimer = undefined;
    }
    el?.classList.remove('is-typing');
  }
}
