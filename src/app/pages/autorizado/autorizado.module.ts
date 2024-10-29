import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AutorizadoPageRoutingModule } from './autorizado-routing.module';

import { AutorizadoPage } from './autorizado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AutorizadoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AutorizadoPage]
})
export class AutorizadoPageModule {}
