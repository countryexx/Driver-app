import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosescolaresPageRoutingModule } from './usuariosescolares-routing.module';

import { UsuariosescolaresPage } from './usuariosescolares.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosescolaresPageRoutingModule
  ],
  declarations: [UsuariosescolaresPage]
})
export class UsuariosescolaresPageModule {}
