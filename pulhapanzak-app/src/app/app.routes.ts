import { Routes } from '@angular/router';
import { AuthGuard } from './auth/services/guards/auth-guard';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/pages/home/home.page').then((m) => m.HomePage),
    //utilizamos el guardia con canActive que sera del tipo arreglo con una
    //funtion que injecta AuthGuard de la ruta auth/services/auth/guards y
    //use el metodo canActive() de AuthGuard
    canActivate : [()=> inject(AuthGuard).canActivate()]
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/pages/login/login.page').then( m => m.LoginPage),
    
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./auth/pages/forgotPassword/forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },
  {
    path: 'tabs',
    loadComponent: () => import('./auth/shared/ui/pages/tabs/tabs.page').then( m => m.TabsPage),
    canActivate : [()=> inject(AuthGuard).canActivate()]
  },
  
  // esta ruta redirige al login cuando la app inicia
  //todavia no
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  
];
