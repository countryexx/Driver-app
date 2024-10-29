import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';
/*
const routes: Routes = [
  {
    path: '',
    component: MenuPage
  }
];*/

const routes: Routes = [
  {
    path: '',
    redirectTo: '/menu/main',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MenuPage,
    children: [
      { path: 'main', loadChildren: () => import('../main/main.module').then( m => m.MainPageModule) },
      { path: 'servicios', loadChildren: () => import('../servicios/servicios.module').then( m => m.ServiciosPageModule) },
      { path: 'historial', loadChildren: () => import('../historial/historial.module').then( m => m.HistorialPageModule) },
      { path: 'fuec', loadChildren: () => import('../fuec/fuec.module').then( m => m.FuecPageModule) },
      { path: 'bioseguridad', loadChildren: () => import('../bioseguridad/bioseguridad.module').then( m => m.BioseguridadPageModule) },
      { path: 'fotob', loadChildren: () => import('../fotob/fotob.module').then( m => m.FotobPageModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
