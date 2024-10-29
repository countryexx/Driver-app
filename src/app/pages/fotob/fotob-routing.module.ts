import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FotobPage } from './fotob.page';

const routes: Routes = [
  {
    path: '',
    component: FotobPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FotobPageRoutingModule {}
