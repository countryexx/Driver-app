import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';
import { IntroGuard } from './guards/intro.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canLoad: [IntroGuard, AutoLoginGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'tab1',
    loadChildren: () => import('./tab1/tab1.module').then(m => m.Tab1PageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'home/:id',
    loadChildren: () => import('./pages/details/details.module').then( m => m.DetailsPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'cuenta',
    loadChildren: () => import('./pages/cuenta/cuenta.module').then( m => m.CuentaPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'historial',
    loadChildren: () => import('./pages/historial/historial.module').then( m => m.HistorialPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'tab0',
    loadChildren: () => import('./pages/tab0/tab0.module').then( m => m.Tab0PageModule)
  },
  {
    path: 'servicios',
    loadChildren: () => import('./pages/servicios/servicios.module').then( m => m.ServiciosPageModule)
  },
  {
    path: 'fuec',
    loadChildren: () => import('./pages/fuec/fuec.module').then( m => m.FuecPageModule)
  },
  {
    path: 'bioseguridad',
    loadChildren: () => import('./pages/bioseguridad/bioseguridad.module').then( m => m.BioseguridadPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'fotob',
    loadChildren: () => import('./pages/fotob/fotob.module').then( m => m.FotobPageModule)
  },
  {
    path: 'details',
    loadChildren: () => import('./pages/details/details.module').then( m => m.DetailsPageModule)
  },
  {
    path: 'novedades',
    loadChildren: () => import('./pages/novedades/novedades.module').then( m => m.NovedadesPageModule)
  },
  {
    path: 'programados',
    loadChildren: () => import('./pages/programados/programados.module').then( m => m.ProgramadosPageModule)
  },
  {
    path: 'recursos',
    loadChildren: () => import('./pages/recursos/recursos.module').then( m => m.RecursosPageModule)
  },
  {
    path: 'errores',
    loadChildren: () => import('./pages/errores/errores.module').then( m => m.ErroresPageModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./pages/usuarios/usuarios.module').then( m => m.UsuariosPageModule)
  },
  {
    path: 'calificacion',
    loadChildren: () => import('./pages/calificacion/calificacion.module').then( m => m.CalificacionPageModule)
  },
  {
    path: 'lecturaqr',
    loadChildren: () => import('./pages/lecturaqr/lecturaqr.module').then( m => m.LecturaqrPageModule)
  },
  {
    path: 'autorizado',
    loadChildren: () => import('./pages/autorizado/autorizado.module').then( m => m.AutorizadoPageModule)
  },
  {
    path: 'firma',
    loadChildren: () => import('./pages/firma/firma.module').then( m => m.FirmaPageModule)
  },
  {
    path: 'usuariosescolares',
    loadChildren: () => import('./pages/usuariosescolares/usuariosescolares.module').then( m => m.UsuariosescolaresPageModule)
  },
  {
    path: 'asistencia',
    loadChildren: () => import('./pages/asistencia/asistencia.module').then( m => m.AsistenciaPageModule)
  },
  {
    path: 'contratante',
    loadChildren: () => import('./pages/contratante/contratante.module').then( m => m.ContratantePageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
