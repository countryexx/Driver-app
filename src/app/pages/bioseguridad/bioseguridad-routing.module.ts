import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BioseguridadPage } from './bioseguridad.page';

const routes: Routes = [
  {
    path: '',
    component: BioseguridadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BioseguridadPageRoutingModule {}
