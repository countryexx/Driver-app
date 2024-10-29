import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DatePipe } from '@angular/common'
import { File } from '@ionic-native/file/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HistorialPage } from './pages/historial/historial.page';
import { ControlService } from './services/control.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuPage } from './pages/menu/menu.page'; 
import { MainPage } from './pages/main/main.page';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';

@NgModule({
  declarations: [AppComponent,HistorialPage],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, FileOpener, ControlService, ReactiveFormsModule, FormsModule, DatePipe, MenuPage, MainPage, File, BackgroundGeolocation],
  bootstrap: [AppComponent],
})
export class AppModule {}
