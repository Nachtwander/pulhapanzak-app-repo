import { Routes } from '@angular/router';
import { AuthGuard } from './auth/services/guards/auth-guard';
import { inject } from '@angular/core';

export const routes: Routes = [
 
  {
    path: 'register',
    loadComponent: () => import('./auth/pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'login',
    //esto es un LazyLoading
    loadComponent: () => import('./auth/pages/login/login.page').then( m => m.LoginPage),
    
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./auth/pages/forgotPassword/forgot-password.page').then( m => m.ForgotPasswordPage)
  },
  {
    //el path vacio por que los que va a obtener es el arbol de rutas de tabs.routes
    path: '',
    //loadChildren es para el arbol de rutas hijas creadas en tabs.routes
    loadChildren: () => import('./auth/shared/ui/pages/tabs/tabs.routes').then((m) => m.routes),
    //utilizamos el guardia con canActive que sera del tipo arreglo con una
    //funtion que injecta AuthGuard de la ruta auth/services/auth/guards y
    //use el metodo canActive() de AuthGuard
    canActivate: [() => inject(AuthGuard).canActivate()],
  },
  // esta ruta redirige al tabs/home cuando esta vacio, si no esta loggeado se activa el guard y envia al login
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
  
];
