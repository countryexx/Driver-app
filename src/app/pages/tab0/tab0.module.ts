import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab0PageRoutingModule } from './tab0-routing.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

import { Tab0Page } from './tab0.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab0PageRoutingModule
  ],
  declarations: [Tab0Page],
  providers: [
    Geolocation,
    NativeGeocoder,
  ]
})
export class Tab0PageModule {}
