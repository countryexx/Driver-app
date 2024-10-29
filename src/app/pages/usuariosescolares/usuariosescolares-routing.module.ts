import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosescolaresPage } from './usuariosescolares.page';

const routes: Routes = [
  {
    path: '',
    component: UsuariosescolaresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosescolaresPageRoutingModule {}
