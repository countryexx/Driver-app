import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErroresPageRoutingModule } from './errores-routing.module';

import { ErroresPage } from './errores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErroresPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ErroresPage]
})
export class ErroresPageModule {}
