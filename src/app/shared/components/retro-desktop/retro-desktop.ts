import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { RetroWindowComponent } from '../retro-window/retro-window';
import { Home } from '../../../pages/home/home';
import { Skills } from '../../../pages/skills/skills';
import { Resume } from '../../../pages/resume/resume';
import { Projects } from '../../../pages/projects/projects';
import { Experience } from '../../../pages/experience/experience';
import { Contact } from '../../../pages/contact/contact';
import { I18nService } from '../../i18n/i18n.service';

interface DesktopWindow {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

@Component({
  selector: 'app-retro-desktop',
  standalone: true,
  imports: [
    CommonModule,
    RetroWindowComponent,
    Home,
    Skills,
    Resume,
    Projects,
    Experience,
    Contact
  ],
  templateUrl: './retro-desktop.html',
  styleUrl: './retro-desktop.css'
})
export class RetroDesktopComponent {
  time = signal(this.formatTime(new Date()));
  startMenuOpen = signal(false);
  highestZ = 100;

  icons = {
    computer: '/icons/retro/computer.png',
    folder: '/icons/retro/folder.png',
    file: '/icons/retro/file.png',
    trash: '/icons/retro/trash.png'
  };

  windows = signal<DesktopWindow[]>([
    { id: 'welcome', title: 'Welcome to ArayaDev', icon: this.icons.computer, isOpen: true, isMinimized: false, zIndex: 100 },
    { id: 'skills', title: 'Installed Programs', icon: this.icons.computer, isOpen: true, isMinimized: true, zIndex: 99 },
    { id: 'projects', title: 'Projects', icon: this.icons.folder, isOpen: true, isMinimized: true, zIndex: 98 },
    { id: 'resume', title: 'Curriculum.exe', icon: this.icons.file, isOpen: true, isMinimized: true, zIndex: 97 },
    { id: 'experience', title: 'Experience', icon: this.icons.folder, isOpen: true, isMinimized: true, zIndex: 96 },
    { id: 'contact', title: 'Contact', icon: this.icons.file, isOpen: true, isMinimized: true, zIndex: 95 }
  ]);

  lang: I18nService['lang'];

  constructor(private i18n: I18nService, private themeService: ThemeService) {
    this.lang = this.i18n.lang;
    setInterval(() => {
      this.time.set(this.formatTime(new Date()));
    }, 1000);
  }

  shutdown() {
    this.themeService.setTheme('dark');
  }

  toggleLang() {
    this.i18n.toggleLang();
  }

  formatTime(d: Date) {
    let h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    const mins = m < 10 ? '0' + m : m;
    return `${h}:${mins} ${ampm}`;
  }

  openWindow(id: string) {
    this.startMenuOpen.set(false);
    this.highestZ++;
    this.windows.update(ws => {
      const w = ws.find(x => x.id === id);
      if (w) {
        w.isOpen = true;
        w.isMinimized = false;
        w.zIndex = this.highestZ;
      }
      return [...ws];
    });
  }

  closeWindow(id: string) {
    this.windows.update(ws => {
      const w = ws.find(x => x.id === id);
      if (w) w.isOpen = false;
      return [...ws];
    });
  }

  minimizeWindow(id: string) {
    this.windows.update(ws => {
      const w = ws.find(x => x.id === id);
      if (w) w.isMinimized = true;
      return [...ws];
    });
  }

  focusWindow(id: string) {
    this.highestZ++;
    this.windows.update(ws => {
      const w = ws.find(x => x.id === id);
      if (w) {
        w.zIndex = this.highestZ;
        if (w.isMinimized) w.isMinimized = false;
      }
      return [...ws];
    });
  }

  toggleStartMenu() {
    this.startMenuOpen.set(!this.startMenuOpen());
  }

  get activeWindowId() {
    const openWindows = this.windows().filter(w => w.isOpen && !w.isMinimized);
    if (openWindows.length === 0) return null;
    return openWindows.reduce((prev, current) => (prev.zIndex > current.zIndex) ? prev : current).id;
  }
}
