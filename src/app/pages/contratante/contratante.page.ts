import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';

import { url } from './../../server';
import { loading_var, modal_mode } from 'src/app/vars';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FuecPage } from '../fuec/fuec.page';

@Component({
  selector: 'app-contratante',
  templateUrl: './contratante.page.html',
  styleUrls: ['./contratante.page.scss'],
})
export class ContratantePage implements OnInit {

  id_usuario:any;
  url_server:any;
  httpOptions:any;
  token:any;

  constructor(private loadinController: LoadingController,
    private http: HttpClient,
    private modalController: ModalController,
    private alertController: AlertController
    ) { 

      this.id_usuario = localStorage.getItem('id_usuario');
      this.url_server = url;
      this.token = localStorage.getItem('token');
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

  async mensaje(){
    
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
    
    this.http.post(this.url_server+'/api/v1/mensaje', data, this.httpOptions).subscribe(async data => {
      
      if(data['respuesta']===true){
        
        console.log('Mensaje enviado!!');

      }else if(data['respuesta']===false){
        

      }        
    }, err => {
      loading.dismiss();
      this.errorAlert();
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

  //ABRIR MODAL DE FUEC
  async buscarFuecs(id) {

    let loading = await this.loadinController.create({
      spinner: loading_var,
      mode: modal_mode,
      cssClass: 'load',
      message: 'Cargando'
    });
  
    loading.present();

    var data = {
      id_usuario: this.id_usuario,
      id: id
    }
    
    this.http.post(this.url_server+'/api/v1/consultafueccliente', data, this.httpOptions).subscribe(async data => {
      
      if(data['respuesta']===true){
        
        const modal = await this.modalController.create({
          component: FuecPage,
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

}
