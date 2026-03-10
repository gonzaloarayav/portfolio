import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Skills } from './pages/skills/skills';
import { Resume } from './pages/resume/resume';
import { Projects } from './pages/projects/projects';
import { Experience } from './pages/experience/experience';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
  { path: '', component: Home, title: 'Inicio' },
  { path: 'aptitudes', component: Skills, title: 'Aptitudes' },
  { path: 'curriculum', component: Resume, title: 'Curriculum' },
  { path: 'proyectos', component: Projects, title: 'Proyectos' },
  { path: 'experiencia', component: Experience, title: 'Experiencia' },
  { path: 'contacto', component: Contact, title: 'Contacto' },
  { path: '**', redirectTo: '' },
];
