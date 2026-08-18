import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../shared/services/theme.service';

export interface Project {
  id: string;
  featured?: boolean;
  badge?: string;
  title?: string;
  titleKey?: string;
  stackKey: string;
  descKey: string;
  visualClass: string;
  icon: string;
  visualText?: string;
  demoUrl: string;
  codeUrl: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, TranslatePipe, CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  theme: ThemeService['theme'];

  projects: Project[] = [
    {
      id: 'p1',
      featured: true,
      badge: 'Featured',
      title: 'UI Portfolio',
      stackKey: 'projects.p1.stack',
      descKey: 'projects.p1.desc',
      visualClass: 'visual-angular',
      icon: 'dashboard',
      visualText: 'ArayaDev Portfolio',
      demoUrl: '#',
      codeUrl: '#'
    },
    {
      id: 'p2',
      titleKey: 'projects.p2.title',
      stackKey: 'projects.p2.stack',
      descKey: 'projects.p2.desc',
      visualClass: 'visual-metrics',
      icon: 'trending_up',
      demoUrl: '#',
      codeUrl: '#'
    },
    {
      id: 'p3',
      title: 'E-commerce UI',
      stackKey: 'projects.p3.stack',
      descKey: 'projects.p3.desc',
      visualClass: 'visual-ecommerce',
      icon: 'shopping_cart',
      demoUrl: '#',
      codeUrl: '#'
    },
    {
      id: 'p4',
      titleKey: 'projects.p4.title',
      stackKey: 'projects.p4.stack',
      descKey: 'projects.p4.desc',
      visualClass: 'visual-task',
      icon: 'list_alt',
      demoUrl: '#',
      codeUrl: '#'
    }
  ];

  constructor(private themeService: ThemeService) {
    this.theme = this.themeService.theme;
  }
}
