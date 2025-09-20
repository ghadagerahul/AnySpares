import { Routes } from '@angular/router';
import { LoginPage } from './components/login-page/login-page';
import { RegisterationPage } from './components/registeration-page/registeration-page';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterationPage },
    { path: '**', redirectTo: 'login' }
];