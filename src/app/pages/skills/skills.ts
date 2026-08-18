import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../shared/services/theme.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [MatIconModule, TranslatePipe, CommonModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills {
  theme: ThemeService['theme'];

  constructor(private themeService: ThemeService) {
    this.theme = this.themeService.theme;
  }
}
