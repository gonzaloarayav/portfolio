import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../shared/services/theme.service';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [MatCardModule, MatListModule, MatIconModule, TranslatePipe, CommonModule],
  templateUrl: './resume.html',
  styleUrl: './resume.css',
})
export class Resume {
  theme: ThemeService['theme'];
  activeTab = 'General';

  constructor(private themeService: ThemeService) {
    this.theme = this.themeService.theme;
  }
}
