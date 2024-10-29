import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutorizadoPage } from './autorizado.page';

const routes: Routes = [
  {
    path: '',
    component: AutorizadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutorizadoPageRoutingModule {}
