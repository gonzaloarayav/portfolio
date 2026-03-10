import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [MatCardModule, MatListModule, MatIconModule],
  templateUrl: './resume.html',
  styleUrl: './resume.css',
})
export class Resume {

}
