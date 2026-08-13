import { Component, HostListener, Inject, PLATFORM_ID, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isBrowser"
      class="custom-cursor"
      [class.cursor-hover]="isHovering"
      [style.left.px]="mouseX"
      [style.top.px]="mouseY"
    ></div>
  `,
  styles: [`
    /* Los estilos están en styles.css para que sean globales y usen variables compartidas */
  `]
})
export class CursorComponent implements AfterViewInit, OnDestroy {
  isBrowser: boolean;
  mouseX = -100;
  mouseY = -100;
  isHovering = false;

  private rafId: number | null = null;
  private targetX = -100;
  private targetY = -100;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.animate();
      this.setupHoverListeners();
    }
  }

  ngOnDestroy(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.isBrowser) {
      document.body.removeEventListener('mouseover', this.onMouseOver);
      document.body.removeEventListener('mouseout', this.onMouseOut);
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.targetX = event.clientX;
    this.targetY = event.clientY;
  }

  private animate = (): void => {
    // Lerp (Linear Interpolation) para movimiento suave
    this.mouseX += (this.targetX - this.mouseX) * 0.2;
    this.mouseY += (this.targetY - this.mouseY) * 0.2;
    
    this.rafId = requestAnimationFrame(this.animate);
  }

  private setupHoverListeners(): void {
    document.body.addEventListener('mouseover', this.onMouseOver);
    document.body.addEventListener('mouseout', this.onMouseOut);
  }

  private onMouseOver = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    // Expande el cursor si está sobre enlaces, botones o elementos interactivos
    if (
      target.tagName.toLowerCase() === 'a' ||
      target.tagName.toLowerCase() === 'button' ||
      target.closest('a') ||
      target.closest('button') ||
      target.closest('.project-card') ||
      target.closest('.skill-pill') ||
      target.closest('.mat-mdc-list-item')
    ) {
      this.isHovering = true;
    }
  }

  private onMouseOut = (): void => {
    this.isHovering = false;
  }
}
