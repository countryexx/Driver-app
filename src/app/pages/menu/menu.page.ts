import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

import { MenuController } from '@ionic/angular';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { ModalController } from '@ionic/angular';
import { ServiciosPage } from '../servicios/servicios.page';
import { FuecPage } from '../fuec/fuec.page';
import { BioseguridadPage } from '../bioseguridad/bioseguridad.page';
import { HistorialPage } from '../historial/historial.page';
import { RecursosPage } from '../recursos/recursos.page';
import { ErroresPage } from '../errores/errores.page';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MainPage } from '../main/main.page';
import { switchMap, tap } from 'rxjs/operators';
import { url } from './../../server';
import { loading_var, modal_mode } from 'src/app/vars';
import { ContratantePage } from '../contratante/contratante.page';


//import { ModalController } from '@ionic/angular';
//import { ModalPage } from '../login/login.page';
declare var google;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  public cards: any;
  public servicios: any;
  nombre:any;
  foto:any;

  id_usuario:any;
  url_server:any;
  httpOptions:any;

  scannedCode = null;
  total:number;

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;
  currentMapTrack = null;
  marker = null;
  image = null;

  latitude: number;
  longitude: number;

  selectedPath = '';
  locations: any;
  locations2: any;
  arr:any;
  array:any;
  token:any;

  constructor(private router: Router, 
    private authService: AuthenticationService, 
    private menu: MenuController, 
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder, 
    public modalController: ModalController, 
    private loadinController: LoadingController, 
    private backgroundGeolocation: BackgroundGeolocation, 
    private barcodeScanner: BarcodeScanner, 
    public toastController: ToastController,
    public alertController: AlertController,
    private http: HttpClient) {
      
      this.nombre = localStorage.getItem('nombre_completo');
      this.foto = localStorage.getItem('foto');

      this.id_usuario = localStorage.getItem('id_usuario');
      this.url_server = url;
      this.token = localStorage.getItem('token');
      this.httpOptions = {
        headers: new HttpHeaders({ "Authorization": localStorage.getItem('token') },)
      };

   }

   async logout() {

    let loading = await this.loadinController.create({
      spinner: loading_var,
      mode: modal_mode,
      message: 'Cerrando la sesión...',
    });
  
    loading.present();

    await this.authService.logout();
    setTimeout(() => {
      this.router.navigateByUrl('/', {replaceUrl : true});
      loading.dismiss();
    }, 2500);

  }

  ngOnInit() {
    
  }

  async errorAlert(){

    const alert = await this.alertController.create({
      cssClass: 'alert-danger',
      header: 'Aotour Mobile Driver',
      message: 'Error de conexión',
      mode: modal_mode,
      buttons: [
        {
          text: 'Cerrar',
        }
      ]
    });
    alert.present();

  }

  //ABRIR MODAL DE SERVICIOS ASIGNADOS
  async serviciosModal() {
    
    let loading = await this.loadinController.create({
      spinner: loading_var,
      mode: modal_mode,
      cssClass: 'load',
      message: 'Cargando'
    });
  
    loading.present();

    var data = {
      id_usuario: this.id_usuario,
    }

    try {
      
      this.http.post(this.url_server+'/api/v1/serviciospendientesporaceptar', data, this.httpOptions).subscribe(async data => {
        console.log(data['respuesta'])
        
        if(data['respuesta']===true){
          
          loading.dismiss();
          const modal = await this.modalController.create({
            component: ServiciosPage,
            cssClass: 'my-custom-class',
            mode: modal_mode,
            componentProps: {
              'data': data['servicios'],
            }
          });
          
          return modal.present();

        }else if(data['respuesta']===false){

          loading.dismiss();
          const alert = await this.alertController.create({
            cssClass: 'alert-danger',
            header: 'Aotour Mobile Driver',
            message: 'No tiene servicios para aceptar',
            mode: modal_mode,
            buttons: [
              {
                text: 'Cerrar',
                handler: () => {
                }
              }
            ]
          });
          alert.present();

        }
        
      }, err => {
        loading.dismiss();
        this.errorAlert();
      });

    } catch (error) {
      console.error('ERROR PRESENTADO: '+error);
    }

  }

    //ABRIR MODAL HISTORIAL DE SERVICIOS
    async historialModal() {

      let loading = await this.loadinController.create({
        spinner: loading_var,
        mode: modal_mode,
        cssClass: 'load',
        message: 'Cargando'
      });
    
      loading.present();
  
      const modal = await this.modalController.create({
        component: HistorialPage,
        cssClass: 'my-custom-class',
        mode: modal_mode,
        componentProps: {
          'data': this.servicios,
        }
      });
  
      setTimeout(() => {
        loading.dismiss();
        return modal.present();
      }, 500);   
  
    }

    //ABRIR MODAL DE FUEC
    async contratanteModal() {

      let loading = await this.loadinController.create({
        spinner: loading_var,
        mode: modal_mode,
        cssClass: 'load',
        message: 'Cargando'
      });
    
      loading.present();

      var data = {
        id_usuario: this.id_usuario,
      }
      
      this.http.post(this.url_server+'/api/v1/consultafuec3', data, this.httpOptions).subscribe(async data => {
        
        if(data['respuesta']===true){
          
          const modal = await this.modalController.create({
            component: ContratantePage,
            mode: modal_mode,
            cssClass: 'my-custom-class',
            componentProps: {
              'fuec': data['fuec'],
            }
          });

          loading.dismiss();
          return modal.present();

        }else if(data['respuesta']===false){

          const alert = await this.alertController.create({
            cssClass: 'alert-danger',
            header: 'Aotour Mobile Driver',
            message: 'No se encontró ningún FUEC con fecha vigente',
            mode: modal_mode,
            buttons: [
              {
                text: 'Cerrar',
                handler: () => {
                  
                }
              }
            ]
          });
          loading.dismiss();
          alert.present();

        }        
      }, err => {
        loading.dismiss();
        this.errorAlert();
      });
    }

    //ABRIR MODAL DE BIOSEGURIDAD
    async bioseguridadModal() {

      let loading = await this.loadinController.create({
        spinner: loading_var,
        mode: modal_mode,
        cssClass: 'load',
        message: 'Cargando'
      });
    
      loading.present();

      const modal = await this.modalController.create({
        component: BioseguridadPage,
        cssClass: 'my-custom-class',
        mode: modal_mode
      });

      setTimeout(() => {
        loading.dismiss();
        return modal.present();
      }, 500);

    }

    //ABRIR MODAL DE RECURSOS
    async recursosModal() {

      let loading = await this.loadinController.create({
        spinner: loading_var,
        mode: modal_mode,
        cssClass: 'load',
        message: 'Cargando'
      });
    
      loading.present();

      const modal = await this.modalController.create({
        component: RecursosPage,
        cssClass: 'my-custom-class',
        mode: modal_mode
      });

      setTimeout(() => {
        loading.dismiss();
        return modal.present();
      }, 500);

    }

    //ABRIR MODAL DE RECURSOS
    async erroresReporte() {

      let loading = await this.loadinController.create({
        spinner: loading_var,
        mode: modal_mode,
        cssClass: 'load',
        message: 'Cargando'
      });
    
      loading.present();

      const modal = await this.modalController.create({
        component: ErroresPage,
        cssClass: 'my-custom-class',
        mode: modal_mode
      });

      setTimeout(() => {
        loading.dismiss();
        return modal.present();
      }, 500);

    }

    dismiss() {
      this.modalController.dismiss({
        'dismissed': true
      });
    }

    scanCode(){

      let code = null;

      this.barcodeScanner.scan().then(barcodeData => {
        this.scannedCode = barcodeData;

        code = JSON.stringify(this.scannedCode.text);
        console.log('Barcode data, L GM, STRINGIFY', code);
        alert('El Escan arrojó el siguiente dato: '+code)
        
      }).catch(err => {
        console.log('Error', err);
      });

    }

}
