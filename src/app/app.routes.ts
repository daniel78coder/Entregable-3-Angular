import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentDetailComponent } from './components/student-detail/student-detail.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { InscriptionListComponent } from '../app/components/inscription-list/inscription-list.component';
import { InscriptionDetailComponent } from '../app/components/inscription-detail/inscription-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  {
    path: 'students',
    component: StudentListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'student/:id',
    component: StudentDetailComponent,
    canActivate: [authGuard],
  },
  { path: 'courses', component: CourseListComponent, canActivate: [authGuard] },
  { path: 'inscriptions', component: InscriptionListComponent, canActivate: [authGuard] },
  { path: 'inscription/new', component: InscriptionDetailComponent, canActivate: [authGuard] },
  { path: 'inscription/:id', component: InscriptionDetailComponent, canActivate: [authGuard] },
  { path: 'users', component: UserListComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/home' },
];
