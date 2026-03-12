import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills {

}
