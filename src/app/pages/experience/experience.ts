import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [MatCardModule, MatListModule, MatIconModule],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class Experience {

}
