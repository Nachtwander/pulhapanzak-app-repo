import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./auth/pages/forgotPassword/forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },
  {
    path: 'tabs',
    loadComponent: () => import('./auth/pages/tabs/tabs.page').then( m => m.TabsPage)
  },
  
  // esta ruta redirige al login cuando la app inicia
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  
];
