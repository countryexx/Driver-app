import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LecturaqrPageRoutingModule } from './lecturaqr-routing.module';

import { LecturaqrPage } from './lecturaqr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LecturaqrPageRoutingModule
  ],
  declarations: [LecturaqrPage]
})
export class LecturaqrPageModule {}
