import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { FuecPageRoutingModule } from './fuec-routing.module';

import { FuecPage } from './fuec.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FuecPageRoutingModule,
    HttpClientModule
  ],
  declarations: [FuecPage]
})
export class FuecPageModule {}
