import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-retro-window',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  template: `
    <div
      class="win95-window"
      [class.maximized]="isMaximized"
      [style.display]="isHidden ? 'none' : 'flex'"
      [style.zIndex]="zIndex"
      cdkDrag
      [cdkDragDisabled]="isMaximized"
      cdkDragBoundary="body"
      (mousedown)="focus()"
      (touchstart)="focus()"
    >
      <div class="win95-titlebar" [class.inactive]="!isActive" cdkDragHandle (dblclick)="toggleMaximize()">
        <div class="title-content">
          <img *ngIf="icon" [src]="icon" class="title-icon" alt="" />
          <span>{{ title }}</span>
        </div>
        <div class="win95-titlebar-controls" (mousedown)="$event.stopPropagation()">
          <button class="win95-btn win95-btn-icon" (click)="minimize.emit()" aria-label="Minimize">_</button>
          <button class="win95-btn win95-btn-icon" (click)="toggleMaximize()" aria-label="Maximize">◻</button>
          <button class="win95-btn win95-btn-icon" (click)="close.emit()" aria-label="Close" style="font-weight:bold;">X</button>
        </div>
      </div>
      <div class="win95-window-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .win95-window {
      position: absolute;
      top: 15vh;
      left: 15vw;
      min-width: 300px;
      min-height: 200px;
      max-width: 90vw;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
    }
    .win95-window.maximized {
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: calc(100vh - 28px) !important;
      max-width: 100vw;
      max-height: 100vh;
      transform: none !important;
    }
    .title-content {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .title-icon {
      width: 16px;
      height: 16px;
      image-rendering: pixelated;
    }
    .win95-window-content {
      padding: 8px;
      flex: 1;
      overflow: auto;
      background: #c0c0c0;
    }
  `]
})
export class RetroWindowComponent {
  @Input() title = 'Application';
  @Input() icon = '';
  @Input() isActive = false;
  @Input() isHidden = false;
  @Input() zIndex = 100;
  
  @Output() close = new EventEmitter<void>();
  @Output() minimize = new EventEmitter<void>();
  @Output() focused = new EventEmitter<void>();

  isMaximized = false;

  toggleMaximize() {
    this.isMaximized = !this.isMaximized;
  }

  focus() {
    this.focused.emit();
  }
}
