import { AfterViewInit, Component, ElementRef, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class Experience implements AfterViewInit, OnDestroy {
  private ctx?: gsap.Context;
  private isBrowser: boolean;
  private mm?: gsap.MatchMedia;

  constructor(
    private elRef: ElementRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.ctx = gsap.context(() => {
      this.mm = gsap.matchMedia();

      this.mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Animación de la línea de tiempo progresiva
        gsap.to('.timeline-line', {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.experience-timeline',
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: true
          }
        });

        // Pulse sutil en cada ícono al hacer scroll
        const items = gsap.utils.toArray('.timeline-item') as HTMLElement[];
        items.forEach(item => {
          gsap.fromTo(item.querySelector('.timeline-icon'), 
            { scale: 0.8, opacity: 0.5 },
            {
              scale: 1,
              opacity: 1,
              ease: 'back.out(1.7)',
              duration: 0.6,
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        });
      });

      this.mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.timeline-line', { scaleY: 1 });
        gsap.set('.timeline-icon', { scale: 1, opacity: 1 });
      });

    }, this.elRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.mm?.revert();
    this.ctx?.revert();
  }
}
