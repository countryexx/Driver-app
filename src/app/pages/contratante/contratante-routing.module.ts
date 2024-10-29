import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContratantePage } from './contratante.page';

const routes: Routes = [
  {
    path: '',
    component: ContratantePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContratantePageRoutingModule {}
