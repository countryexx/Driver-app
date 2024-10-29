import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { url } from './../../server';
import { loading_var, modal_mode } from 'src/app/vars';

@Component({
  selector: 'app-bioseguridad',
  templateUrl: './bioseguridad.page.html',
  styleUrls: ['./bioseguridad.page.scss'],
})
export class BioseguridadPage implements OnInit {

  id_usuario:any;
  url_server:any;
  httpOptions:any;
  
  constructor(public toastController: ToastController, 
    private loadinController: LoadingController, 
    public modalController: ModalController,
    private http: HttpClient,
    private alertController: AlertController) {
    
    this.id_usuario = localStorage.getItem('id_usuario');
    this.url_server = url;
    this.httpOptions = {
      headers: new HttpHeaders({ "Authorization": localStorage.getItem('token') },)
    };

   }

  ngOnInit() {
  }
  
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
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
  
  async enviarReporte(){

    const loading = await this.loadinController.create({
      spinner: loading_var,
      mode: modal_mode
    });
    await loading.present();

    var data = {
      usuario: this.id_usuario,
    }
    
    this.http.post(this.url_server+'/api/v1/reporteslimpieza', data, this.httpOptions).subscribe(async data => {
      console.log(data['mensaje'])
      
      if(data['mensaje']===true){
        
        const toast = await this.toastController.create({
          message: '¡Reporte Enviado!',
          color: 'primary',
          duration: 5000,
          position: 'top',
          mode: modal_mode,
          buttons: [
            {
              side: 'start',
              icon: 'close',
              handler: () => {
              }
            },
          ]
        });

        loading.dismiss();

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
