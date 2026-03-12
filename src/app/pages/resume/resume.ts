import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [MatCardModule, MatListModule, MatIconModule, TranslatePipe],
  templateUrl: './resume.html',
  styleUrl: './resume.css',
})
export class Resume {

}
