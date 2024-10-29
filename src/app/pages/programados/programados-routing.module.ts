import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramadosPage } from './programados.page';

const routes: Routes = [
  {
    path: '',
    component: ProgramadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramadosPageRoutingModule {}
