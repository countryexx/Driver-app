import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { modal_mode } from 'src/app/vars';
import { FirmaPage } from '../firma/firma.page';

import { url } from './../../server';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.page.html',
  styleUrls: ['./calificacion.page.scss'],
})
export class CalificacionPage implements OnInit {

  total:any;
  total_actitud:any;

  id_usuario:any;
  url_server:any;
  httpOptions:any

  servicio_activo:any;
  deshabilitar:any;
  recoger: any;
  dejar: any;
  hora: any;
  cliente: any;
  id: any;
  data: any;

  data_uno:any;
  data_dos:any;

  constructor(private loadinController: LoadingController,
    private http: HttpClient,
    private alertController: AlertController,
    private modalController: ModalController) { 
    this.total = 0;
    this.total_actitud = 0;
    this.data = '';

    this.id_usuario = localStorage.getItem('id_usuario');
    //this.url_server = 'http://localhost/autonet';
    this.url_server = url;
    this.httpOptions = {
      headers: new HttpHeaders({ "Authorization": localStorage.getItem('token') },)
    };

    this.data_uno = 0;
    this.data_dos = 0;
  }

  ngOnInit() {
  }

  rateForm = new FormGroup({    
    rate1: new FormControl(''),
    rate2: new FormControl('')
  });

  uno(){
    this.total = 1;
  }
  dos(){
    this.total = 2;
  }
  tres(){
    this.total = 3;
  }
  cuatro(){
    this.total = 4;
  }
  cinco(){
    this.total = 5;
  }

  uno_actitud(){
    this.total_actitud = 1;
  }
  dos_actitud(){
    this.total_actitud = 2;
  }
  tres_actitud(){
    this.total_actitud = 3;
  }
  cuatro_actitud(){
    this.total_actitud = 4;
  }
  cinco_actitud(){
    this.total_actitud = 5;
  }

  async firmar(id) {

    if(this.rateForm.value.rate1==='' || this.rateForm.value.rate2===''){

      this.data = '';

      if(this.rateForm.value.rate1===''){
        this.data+="Es necesario que el pasajero califique:<br> <b>CALIDAD DEL SERVICIO</b>"
      }
      if(this.rateForm.value.rate2===''){
        this.data+="<br>Es necesario que el pasajero califique:<br> <b>ACTITUD DEL CONDUCTOR</b>";
      }
      var alert = null;
      
      alert = await this.alertController.create({
        cssClass: 'alert-danger',
        header: 'Aotour Mobile Driver',
        mode: modal_mode,
        message: this.data,
        buttons: [
          {
            text: 'Reintentar',
          }
        ]
      });
      alert.present();

    }else{

      const modal = await this.modalController.create({
        component: FirmaPage,
        cssClass: 'my-custom-class',
        mode: modal_mode,
        componentProps: {
          'id': id,
          'calificacion_calidad': this.rateForm.value.rate1,
          'calificacion_actitud': this.rateForm.value.rate2
        }
      });

      modal.onDidDismiss().then((data) => {
        
      });
      
      return modal.present();
      
    }
    
  }

  enviar(){
    
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true,
      'role': 1
    });
  }

}
