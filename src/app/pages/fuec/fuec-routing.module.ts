import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FuecPage } from './fuec.page';

const routes: Routes = [
  {
    path: '',
    component: FuecPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FuecPageRoutingModule {}
