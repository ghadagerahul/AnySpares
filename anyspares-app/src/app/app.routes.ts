import { Routes } from '@angular/router';
import { LoginPage } from './components/login-page/login-page';
import { RegisterationPage } from './components/registeration-page/registeration-page';
import { Dashboard } from './components/dashboard/dashboard';
import { TwowheelersDashboard } from './components/two-wheelers/twowheelers-dashboard/twowheelers-dashboard';
import { ForgotPasswordComponent } from './components/forgot-password.component/forgot-password.component';
import { TwoWheelersModels } from './components/two-wheelers/two-wheelers-models/two-wheelers-models';
import { TwoWheelersCategory } from './components/two-wheelers/two-wheelers-category/two-wheelers-category';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterationPage },
  { path: 'dashboard', component: Dashboard },
  { path: 'twowheelersdashboard', component: TwowheelersDashboard },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'twowheelers-models', component: TwoWheelersModels },
  { path: 'twowheelers-category', component: TwoWheelersCategory },
  { path: '**', redirectTo: 'login' }
];