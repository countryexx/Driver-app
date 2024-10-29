import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { loading_var, modal_mode } from 'src/app/vars';

import validator from 'validator';
import { url } from './../../server';

@Component({
  selector: 'app-errores',
  templateUrl: './errores.page.html',
  styleUrls: ['./errores.page.scss'],
})
export class ErroresPage implements OnInit {

  sw:any;
  id_usuario:any;
  url_server:any;
  httpOptions:any;

  constructor(private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadinController: LoadingController,
    private http: HttpClient) { 
      
      this.sw=0;
      this.id_usuario = localStorage.getItem('id_usuario');
      this.url_server = url;
      this.httpOptions = {
        headers: new HttpHeaders({ "Authorization": localStorage.getItem('token') },)
      };

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

  reporteForm = new FormGroup({
    descripcion: new FormControl(''),
  });
  loginFormValidator = {
    descripcion: {empty:''},
  }

  //FUNCIÓN PARA CERRAR EL MODAL
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async reportar(){

    const toast = await this.toastController.create({
      message: '<b>¿Confirma el envío del reporte?</b>',
      color: 'warning',
      position: 'top',
      mode: modal_mode,
      buttons: [
        {
          side: 'end',
          text: 'SI',
          handler: () => {
            this.reporteError();
          }
        },
        {
          side: 'start',
          text: 'NO',
          handler: () => {
            this.sw=0;
          }
        },
      ]
    });

    this.sw = 1;

    toast.present();

  }

  //FUNCIÓN PARA REPORTE DE ERRORES
  async reporteError() {
    
    let loading = await this.loadinController.create({
      spinner: loading_var,
      mode: modal_mode
    });
  
    loading.present();

    var data = {
      id_usuario: this.id_usuario,
      descripcion: this.reporteForm.value.descripcion
    }
    
    this.http.post(this.url_server+'/api/v1/reporteserrores', data, this.httpOptions).subscribe(async data => {
      
      if(data['respuesta']===true){
        
        loading.dismiss();
        
        const toast = await this.toastController.create({
          message: 'Gracias por tu reporte!<br><br>El mensaje fue enviado exitosamente.',
          color: 'primary',
          duration: 6000,
          position: 'top',
          mode: modal_mode,
          buttons: [
            {
              side: 'start',
              icon: 'close',
            },
          ]
        });
        toast.present();

        this.modalController.dismiss({
          'dismissed': true
        });

      }    
    }, err => {
      loading.dismiss();
      this.errorAlert();
    });

  }

}
