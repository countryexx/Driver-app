import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecursosPageRoutingModule } from './recursos-routing.module';

import { RecursosPage } from './recursos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecursosPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RecursosPage]
})
export class RecursosPageModule {}
