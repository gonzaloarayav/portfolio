import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class Experience {

}
