import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit, OnDestroy {
  @ViewChild('heroName', { static: true }) heroNameEl?: ElementRef<HTMLElement>;
  @ViewChild('workspace', { static: false }) workspaceEl?: ElementRef<HTMLElement>;

  private typingTimer?: number;
  private fullName = '';
  private ctx?: gsap.Context;
  private isBrowser: boolean;
  private mm?: gsap.MatchMedia;

  constructor(
    private zone: NgZone,
    private elRef: ElementRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;
    
    const el = this.heroNameEl?.nativeElement;
    if (el) {
      this.fullName = (el.textContent ?? '').trim();
    }

    this.zone.runOutsideAngular(() => {
      this.ctx = gsap.context(() => {
        this.mm = gsap.matchMedia();

        this.mm.add('(prefers-reduced-motion: no-preference)', () => {
          // Animación de entrada Stagger
          const tl = gsap.timeline({ delay: 0.1 });
          tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' })
            .from('.section-header', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
            .from('.lead', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
            .from('.cta-group', { scale: 0.95, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' }, '-=0.3')
            .from('.hero-tech-row .tech-badge', {
              y: 15, opacity: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out'
            }, '-=0.2')
            .from('.dev-workspace', {
              x: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
              onComplete: () => this.startTyping()
            }, '-=0.5')
            .from('.floating-badge', {
              scale: 0.8, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)'
            }, '-=0.4');

          // Animación contadores (Métricas)
          const stats = gsap.utils.toArray('.stat-value') as HTMLElement[];
          stats.forEach((stat) => {
            const finalVal = parseInt(stat.innerText.replace(/[^0-9]/g, ''), 10);
            const textObj = { val: 0 };
            
            // Guardamos el sufijo original (ej. '+')
            const suffix = stat.innerText.replace(/[0-9]/g, '');

            gsap.to(textObj, {
              val: finalVal,
              duration: 1.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: stat,
                start: 'top 85%',
                once: true
              },
              onUpdate: () => {
                stat.innerText = Math.floor(textObj.val) + suffix;
              }
            });
          });
        });
        
        // Versión reducida si prefers-reduced-motion está activo
        this.mm.add('(prefers-reduced-motion: reduce)', () => {
          gsap.set(['.hero-badge', '.section-header', '.lead', '.cta-group', '.hero-tech-row .tech-badge', '.dev-workspace', '.floating-badge'], { opacity: 1, x: 0, y: 0, scale: 1 });
          this.startTyping();
        });

      }, this.elRef.nativeElement);

      this.setupTiltEffect();
    });
  }

  ngOnDestroy() {
    this.stopTyping();
    this.mm?.revert();
    this.ctx?.revert();
    if (this.isBrowser) {
      document.removeEventListener('mousemove', this.onMouseMove);
    }
  }

  private setupTiltEffect() {
    // Solo si el usuario no tiene preferencia de movimiento reducido y no es táctil
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || 
        window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      return;
    }
    document.addEventListener('mousemove', this.onMouseMove);
  }

  private onMouseMove = (e: MouseEvent) => {
    const workspace = document.querySelector('.dev-workspace') as HTMLElement;
    if (!workspace) return;
    
    // Calcula la posición relativa al centro de la ventana
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    
    // Máximo 5 grados
    gsap.to(workspace, {
      rotationY: x * 10,
      rotationX: -y * 10,
      transformPerspective: 1000,
      ease: 'power1.out',
      duration: 0.5
    });
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
