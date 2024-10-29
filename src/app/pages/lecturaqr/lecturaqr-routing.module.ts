import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LecturaqrPage } from './lecturaqr.page';

const routes: Routes = [
  {
    path: '',
    component: LecturaqrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LecturaqrPageRoutingModule {}
