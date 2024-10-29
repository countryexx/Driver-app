import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { loading_var, modal_mode } from 'src/app/vars';

import { MenuPage } from '../menu/menu.page';
import { url } from './../../server';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {

  id_usuario:any;
  url_server:any;
  httpOptions:any;
  token: string;
  services: any;
  inicial:any;
  recargo:any;

  constructor(private loadinController: LoadingController, 
    public toastController: ToastController, 
    public modalController: ModalController,
    private alertController: AlertController,
    private http: HttpClient,
    public main: MenuPage,
    private actionSheetController: ActionSheetController) { 
      
      this.id_usuario = localStorage.getItem('id_usuario');
      this.url_server = url;
      this.token = 'Bearer q83HseTW1hXYQncT8eJSVbmooMLhSwITkx9c7Ec3';
      this.httpOptions = {
        headers: new HttpHeaders({ "Authorization": localStorage.getItem('token') },)
      };

      this.inicial = 0;
      this.recargo = 0;
      
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

  async aceptarServicio(id){

    let loading = await this.loadinController.create({
      spinner: loading_var,
      mode: modal_mode
    });
  
    loading.present();

    var data = {
      id_servicio: id
    }
    
    this.http.post(this.url_server+'/api/v1/servicioaceptar', data, this.httpOptions).subscribe(async data => {
      
      if(data['respuesta']===true){
        
        const toast = await this.toastController.create({
          message: '¡Servicio Aceptado!',
          color: 'primary',
          position: 'top',
          duration: 4000,
          mode: modal_mode,
          buttons: [
            {
              side: 'start',
              icon: 'close'
            },
          ]
        });

        loading.dismiss();
        
        toast.present();

        this.serviciosPorAceptar();

      }
    }, err => {
      loading.dismiss();
      this.errorAlert();
    });

  }

  async serviciosPorAceptar(){
    this.inicial = 1;
    let loading = await this.loadinController.create({
      spinner: loading_var,
      mode: modal_mode
    });
  
    loading.present();

    var data = {
      id_usuario: this.id_usuario,
    }

    this.http.post(this.url_server+'/api/v1/serviciospendientesporaceptar', data, this.httpOptions).subscribe(async data => {
      
      if(data['respuesta']===true){

        this.services = data['servicios'];

      }else if(data['respuesta']===false){

        this.dismiss();

        const alert = await this.alertController.create({
          cssClass: 'alert-danger',
          header: 'Aotour Mobile Driver',
          message: 'Ya no tiene servicios para aceptar',
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

      loading.dismiss();
      
    }, err => {
      loading.dismiss();
      this.errorAlert();
    });

  }

  async preguntarRechazo(id){

    const actionSheet = await this.actionSheetController.create({
      header: 'Motivo del Rechazo',
      cssClass: 'my-custom-class',
      backdropDismiss: false,
      mode: modal_mode,
      buttons: [{
        text: 'Tengo otro servicio',
        icon: 'repeat',
        handler: () => {
          this.rechazarServicio(id,1)
        }
      }, {
        text: 'Tiempo entre servicios',
        icon: 'hourglass',
        handler: () => {
          this.rechazarServicio(id,2)
        }
      }, {
        text: 'Razón personal',
        icon: 'people-circle',
        handler: () => {
          this.rechazarServicio(id,3)
        }
      }, {
        text: 'Pico y placa',
        icon: 'warning',
        handler: () => {
          this.rechazarServicio(id,4)
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
    
  }

  async rechazarServicio(id, seleccion){

    let loading = await this.loadinController.create({
      spinner: loading_var,
      mode: modal_mode
    });
  
    loading.present();

    var data = {
      id_servicio: id,
      sw: seleccion
    }
    
    this.http.post(this.url_server+'/api/v1/serviciorechazar2', data, this.httpOptions).subscribe(async data => {
      
      if(data['respuesta']===true){
        
        const toast = await this.toastController.create({
          message: '¡Servicio Rechazado!',
          color: 'danger',
          position: 'top',
          duration: 4000,
          mode: modal_mode,
          buttons: [
            {
              side: 'start',
              icon: 'close',
            },
          ]
        });

        loading.dismiss();
        
        toast.present();

        this.serviciosPorAceptar();

      }
    }, err => {
      loading.dismiss();
      this.errorAlert();
    });

  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
