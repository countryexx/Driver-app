import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, ToastController, LoadingController, ActionSheetController } from '@ionic/angular';

import { UsuariosPage } from '../usuarios/usuarios.page'; 

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LecturaqrPage } from '../lecturaqr/lecturaqr.page';

import { MainPage } from '../main/main.page';
import { TrackerService } from 'src/app/services/tracker.service';
import { AutorizadoPage } from '../autorizado/autorizado.page';
import { url } from './../../server';
import { UsuariosescolaresPage } from '../usuariosescolares/usuariosescolares.page';
import { AsistenciaPage } from '../asistencia/asistencia.page';
import { loading_var, modal_mode } from 'src/app/vars';

@Component({
  selector: 'app-programados',
  templateUrl: './programados.page.html',
  styleUrls: ['./programados.page.scss'],
})
export class ProgramadosPage implements OnInit {

  total:number;
  scannedCode = null;
  selectedPath = '';
  locations: any;
  locations2: any;
  arr:any;
  array:any;
  usuarios:any;

  sw:any;
  cards:any;
  data: any;
  servicioGobal:any;

  id_usuario:any;
  url_server:any;
  httpOptions:any;
  token: string;

  nombre_estudiante:any;

  constructor(private modalController: ModalController, 
    private barcodeScanner: BarcodeScanner,
    private backgroundGeolocation: BackgroundGeolocation,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadinController: LoadingController,
    private http: HttpClient,
    public main: MainPage,
    public gps: TrackerService,
    private actionSheetController: ActionSheetController) {

      this.locations = [];
      this.locations2 = [];
      this.arr = [];
      this.array = [];
      this.total = 0;
      this.sw=1;

      this.nombre_estudiante = null;

      this.id_usuario = localStorage.getItem('id_usuario');
      this.servicioGobal = localStorage.getItem('servicioGobal');
      this.url_server = url;
      this.httpOptions = {
        headers: new HttpHeaders({ "Authorization": localStorage.getItem('token') },)
      };
/*
      const config: BackgroundGeolocationConfig = {

        desiredAccuracy: 1,
        stationaryRadius: 1,
        distanceFilter: 1,
        interval: 1000,
        fastestInterval: 2000,
        activitiesInterval: 4000,
        notificationTitle: 'Aotour Mobile Driver',
        notificationText: 'Seguimiento en proceso',
        notificationIconColor: '#4caf50',

        debug: true, //  enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      };

      this.backgroundGeolocation.configure(config)
      .then(() => {

        this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
          
          this.locations = location;

          this.arr.push(location);
          let value = this.arr.length;
          console.log('AURA GÓMEZ: '+value);

          var data = {
            lat: this.arr[value-1].latitude,
            lng: this.arr[value-1].longitude,
            speed: this.arr[value-1].speed
          };

          this.array.push(data);
          this.locations = JSON.stringify(this.array);

          localStorage.setItem("location", this.locations);
          localStorage.setItem("locations", this.locations);

        });

      });*/

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

  doRefresh(event) {
    this.sw=0;
    console.log('Begin async operation');

    var data = {
      id_usuario: this.id_usuario
    }
    
    this.http.post(this.url_server+'/api/v1/serviciospendientes', data, this.httpOptions).subscribe(async data => {
      
      if(data['respuesta']===true){
        
        this.data = data['servicios'];

      }
      event.target.complete();
      this.sw=1;
    }, err => {
      this.errorAlert();
    });

  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true,
      'role': 1
    });
  }

  async scanCode1(){

    var direccion1 = 'CALLE+49B+%2313B+1+-+15';
    var direccion2 = 'CARRERA+7A+%2355A+-+11'
    var direccion3 = 'CALLE+72+%2312-25+PORTAL+DE+MANANTIALES,+MZNA+4+TORRE+21,+APTO+4303'

    var ubicacion = '10.993664,-74.7995136';
    var direccion = '';

    window.open("https://www.google.com/maps/dir/"+ubicacion+'/'+direccion1+'/'+direccion2+'/'+direccion3)

  }

  async scanCode(id){

    let code = null;

    this.barcodeScanner.scan().then(async barcodeData => {
      this.scannedCode = barcodeData;

      code = JSON.stringify(this.scannedCode.text).replace(/['"]+/g, '');

      //code = '52794106';

      if(code!=null && code!=''){
        //alert('Data escaneada: '+code)

        let loading = await this.loadinController.create({
          spinner: loading_var,
          mode: modal_mode
        });
      
        loading.present();

        var data = {
          id_servicio: id,
          codigo: code
        }
        
        this.http.post(this.url_server+'/api/v1/scaneodeqr', data, this.httpOptions).subscribe(async data => {
          
          if(data['escaneado']===false){

            loading.dismiss();
            const alert = await this.alertController.create({
              cssClass: 'alert-danger',
              header: 'Aotour Mobile Driver',
              message: 'El pasajero ya fue escaneado.',
              mode: modal_mode,
              buttons: [
                {
                  text: 'Cerrar',
                }
              ]
            });
            alert.present();

          }else if(data['respuesta']===true){
            
            const modal = await this.modalController.create({
              component: LecturaqrPage,
              cssClass: 'my-custom-class',
              mode: modal_mode,
              componentProps: {
                'usuarios': data['usuarios'],
              }
            });

            loading.dismiss();
            return modal.present();
    
          }else if(data['respuesta']===false){
            
            loading.dismiss();
            const alert = await this.alertController.create({
              cssClass: 'alert-danger',
              header: 'Aotour Mobile Driver',
              message: 'El pasajero escaneado no se encuentra programado en esta ruta.',
              mode: modal_mode,
              buttons: [
                {
                  text: 'Cerrar',
                }
              ]
            });
            alert.present();
    
          }
        }, err => {
          loading.dismiss();
          this.errorAlert();
        });

      }else{
        
        const alert = await this.alertController.create({
          cssClass: 'alert-danger',
          header: 'Aotour Mobile Driver',
          message: 'No se leyó ningún código.',
          mode: modal_mode,
          buttons: [
            {
              text: 'Cerrar',
            }
          ]
        });
        alert.present();
      }
      
    }).catch(err => {
      console.log('Error', err);
    });

  }

  //RUTA ESCOLAR START
  async scanCodeE(id){

    let code = null;

    this.barcodeScanner.scan().then(async barcodeData => {
      this.scannedCode = barcodeData;

      code = JSON.stringify(this.scannedCode.text).replace(/['"]+/g, '');

      //code = '2021';

      if(code!=null && code!=''){
        //alert('Data escaneada: '+code)

        let loading = await this.loadinController.create({
          spinner: loading_var,
          mode: modal_mode
        });
      
        loading.present();

        var data = {
          id_servicio: id,
          codigo: code
        }
        
        this.http.post(this.url_server+'/api/v1/scaneodeqre', data, this.httpOptions).subscribe(async data => {
          
          if(data['escaneado']===false){

            loading.dismiss();
            const alert = await this.alertController.create({
              cssClass: 'alert-danger',
              header: 'Aotour Mobile Driver',
              message: 'El pasajero ya fue escaneado.',
              mode: modal_mode,
              buttons: [
                {
                  text: 'Cerrar',
                }
              ]
            });
            alert.present();

          }else if(data['respuesta']===true){
            
            loading.dismiss();

            const actionSheet = await this.actionSheetController.create({
              header: 'Usuario Escaneado',
              mode: modal_mode,
              cssClass: 'my-custom-class',
              buttons: [{
                text: data['usuario']['nombre_estudiante'],
                icon: 'person'
              },
              {
                text: data['usuario']['direccion'],
                icon: 'location'
              }, {
                text: 'Volver',
                icon: 'arrow-back',
                role: 'cancel'
              }]
            });
            await actionSheet.present();            
    
          }else if(data['respuesta']===false){
            
            loading.dismiss();
            const alert = await this.alertController.create({
              cssClass: 'alert-danger',
              header: 'Aotour Mobile Driver',
              message: 'El pasajero escaneado no se encuentra programado en esta ruta.',
              mode: modal_mode,
              buttons: [
                {
                  text: 'Cerrar',
                }
              ]
            });
            alert.present();
    
          }
        }, err => {
          loading.dismiss();
          this.errorAlert();
        });

      }else{
        
        const alert = await this.alertController.create({
          cssClass: 'alert-danger',
          header: 'Aotour Mobile Driver',
          message: 'No se leyó ningún código.',
          mode: modal_mode,
          buttons: [
            {
              text: 'Cerrar',
            }
          ]
        });
        alert.present();
      }
      
    }).catch(err => {
      console.log('Error', err);
    });

  }
  //RUTA ESCOLAR END

  async preguntarIniciar(id){

    const toast = await this.toastController.create({
      message: '¿Confirma el Inicio del servicio?',
      color: 'tertiary',
      position: 'top',
      mode: modal_mode,
      buttons: [
        {
          side: 'end',
          text: 'SI',
          handler: () => {
            this.iniciarServicio(id);
          }
        },
        {
          side: 'start',
          text: 'NO',
          handler: () => {
          }
        },
      ]
    });
    toast.present();
  }

  async iniciarServicio(id){
    
    let loading = await this.loadinController.create({
      spinner: loading_var,
      mode: modal_mode
    });
  
    loading.present();

    var data = {
      id_servicio: id
    }
    
    this.http.post(this.url_server+'/api/v1/horainiciov2', data, this.httpOptions).subscribe(async data => {
      
      if(data['response']===true){
     
        const toast = await this.toastController.create({
          message: 'Servicio Iniciado!',
          color: 'tertiary',
          mode: modal_mode,
          duration: 5000,
          buttons: [
            {
              side: 'start',
              icon: 'close',
            },
          ]
        });
    
        toast.present();
        localStorage.setItem('servicio_activo', 'activo');
        localStorage.setItem('servicioGobal',id);
        
        localStorage.setItem('recoger',data['servicio'].recoger_en);
        localStorage.setItem('dejar', data['servicio'].dejar_en);
        localStorage.setItem('hora', data['servicio'].hora_servicio);
        localStorage.setItem('cliente', data['cliente']);
        localStorage.setItem('tipo_servicio', data['servicio'].ruta);
        localStorage.setItem('pasajeros', data['servicio'].pasajeros);
        
        loading.dismiss();

        this.modalController.dismiss({
          'dismissed': true          
        });

        this.gps.configuracionGPS(id);
        this.listaUsuarios(2,id);
        
      }else if(data['response']==='activo'){
        
        loading.dismiss();
        
        const toast = await this.toastController.create({
          message: 'Tiene un servicio activo...',
          color: 'danger',
          position: 'top',
          mode: modal_mode,
          buttons: [
            {
              side: 'start',
              text: 'Cerrar',
              handler: () => {
              }
            },
          ]
        });
        toast.present();

      }
    }, err => {
      loading.dismiss();
      this.errorAlert();
    });    
  }

  async listaUsuarios(sw,id){

    let loading = await this.loadinController.create({
      spinner: loading_var,
      mode: modal_mode
    });
  
    loading.present();

    var data = {
      id_servicio: id
    }
    
    this.http.post(this.url_server+'/api/v1/listapasajeros', data, this.httpOptions).subscribe(async data => {
      
      if(data['respuesta']===true){

        loading.dismiss();

        if(sw===1){

          const modal = await this.modalController.create({
            component: UsuariosPage,
            cssClass: 'my-custom-class',
            mode: modal_mode,
            componentProps: {
              'data': data['usuarios'],
            }
          });
          return modal.present();

        }else{

          localStorage.setItem('pasajerosRuta', JSON.stringify(data['usuarios']));

        }

      }else if(data['respuesta']===false){

        loading.dismiss();

        if(sw===1){

          const alert = await this.alertController.create({
            cssClass: 'alert-danger',
            header: 'Aotour Mobile Driver',
            message: 'Esta ruta no tiene pasajeros!',
            mode: modal_mode,
            buttons: [
              {
                text: 'Cerrar',
              }
            ]
          });
  
          alert.present();

        }else{

          localStorage.removeItem('pasajerosRuta');

        }
        
      }

    }, err => {
      loading.dismiss();
      this.errorAlert();
    });

  }

  async listaUsuariosE(id){

    let loading = await this.loadinController.create({
      spinner: loading_var,
      mode: modal_mode
    });
  
    loading.present();

    var data = {
      id_servicio: id
    }
    
    this.http.post(this.url_server+'/api/v1/listapasajerose', data, this.httpOptions).subscribe(async data => {
      
      if(data['respuesta']===true){

        loading.dismiss();

        const modal = await this.modalController.create({
          component: UsuariosescolaresPage,
          mode: modal_mode,
          cssClass: 'my-custom-class',
          componentProps: {
            'data': data['usuarios'],
          }
        });
        return modal.present();

      }else if(data['respuesta']===false){

        loading.dismiss();

        const alert = await this.alertController.create({
          cssClass: 'alert-danger',
          header: 'Aotour Mobile Driver',
          message: 'Esta ruta no tiene pasajeros!',
          mode: modal_mode,
          buttons: [
            {
              text: 'Cerrar',
            }
          ]
        });

        alert.present();
        
      }

    }, err => {
      loading.dismiss();
      this.errorAlert();
    });

  }

  async AgregarAutorizado(id){

    const modal = await this.modalController.create({
      component: AutorizadoPage,
      mode: modal_mode,
      cssClass: 'my-custom-class',
      componentProps: {
        'id': id
      }
    });

    return modal.present();
    

  }

}
