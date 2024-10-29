import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FotobPageRoutingModule } from './fotob-routing.module';

import { FotobPage } from './fotob.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FotobPageRoutingModule
  ],
  declarations: [FotobPage]
})
export class FotobPageModule {}
