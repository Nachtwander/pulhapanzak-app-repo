import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from 'src/app/auth/services/guards/auth-guard';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: 'tabs', //ruta 'tabs'
    component: TabsPage, //usamos el componente TabsPage
    children: [
      //Aqui colocamos las rutas que vamos a utilizar para redirigir al usuario cuando de clic en una opcion del TabBar

      // Ruta de home o Inicio
      {
        path: 'home',
        //con los ./../.. retrocedemos en el arbol de carpetas y y buscamos los pages que pcupemos en estas rutas
        loadComponent: () =>import('./../../../../../home/pages/home/home.page').then((m) => m.HomePage),
      },
      // Ruta de gallery o Galeria
      {
        path: 'gallery',
        loadComponent: () =>import('./../../../../../gallery/pages/gallery/gallery.page').then((m) => m.GalleryPage),
      },
      // Ruta de profile o Perfil
      {
        path: 'profile',
        loadComponent: () =>import('./../../../../../profile/pages/profile/profile.page').then((m) => m.ProfilePage),
      },
    ],
  },
  //ruta inicial o si el path esta vacio
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
];
