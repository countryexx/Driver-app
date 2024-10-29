import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgramadosPageRoutingModule } from './programados-routing.module';

import { ProgramadosPage } from './programados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgramadosPageRoutingModule
  ],
  declarations: [ProgramadosPage]
})
export class ProgramadosPageModule {}
