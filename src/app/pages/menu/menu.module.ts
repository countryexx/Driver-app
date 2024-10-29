import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { MenuPageRoutingModule } from './menu-routing.module';

import { MenuPage } from './menu.page';
import { Routes } from '@angular/router';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

import { RouteReuseStrategy } from '@angular/router';

const routes : Routes = [
  {
    path: '',
    redirectTo: '/menu/main',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'servicios',
        loadChildren: '../pages/servicios/servicios.module#ServiciosPageModule'
      },
      {
        path: 'historial',
        loadChildren: '../pages/historial/historial.module#HistorialPageModule'
      },
      {
        path: 'fuec',
        loadChildren: '../pages/fuec/fuec.module#FuecPageModule'
      },
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuPageRoutingModule,
  ],
  declarations: [MenuPage],
  providers: [
    Geolocation,
    NativeGeocoder,
    BarcodeScanner,
    BackgroundGeolocation,
    FileOpener,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ]
})
export class MenuPageModule {}
