import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController, ActionSheetController } from '@ionic/angular';
import { loading_var, modal_mode } from 'src/app/vars';
import { url } from './../../server';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.page.html',
  styleUrls: ['./novedades.page.scss'],
})
export class NovedadesPage implements OnInit {

  id_usuario:any;
  url_server:any;
  httpOptions:any;

  estate:any;

  constructor(private modalController: ModalController,
    private alertController: AlertController,
    private loadinController: LoadingController,
    private toastController: ToastController,
    public actionSheetController: ActionSheetController,
    private http: HttpClient) {

      this.id_usuario = localStorage.getItem('id_usuario'); 
      this.url_server = url;
      this.httpOptions = {
        headers: new HttpHeaders({ "Authorization": localStorage.getItem('token') },)
      };
      this.estate = 0;

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

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccione el tipo de Novedad',
      backdropDismiss: false,
      cssClass: 'my-custom-class',
      mode: modal_mode,
      buttons: [{
        text: 'Parada Adicional',
        icon: 'car',
        handler: () => {
          console.log('Delete clicked');
          this.estate = 1;
        }
      }, {
        text: 'Tiempo de Espera',
        icon: 'time',
        handler: () => {
          console.log('Share clicked');
          this.estate = 2;
        }
      }, {
        text: 'Parada Adicional y Tiempo de Espera',
        icon: 'timer',
        handler: () => {
          console.log('Play clicked');
          this.estate = 3;
        }
      }, {
        text: 'No Show',
        icon: 'alert-circle',
        handler: () => {
          console.log('Favorite clicked');
          this.estate = 4;
        }
      }, {
        text: 'Otros',
        icon: 'code-working',
        handler: () => {
          console.log('Cancel clicked');
          this.estate = 5;
        }
      },
      {
        text: 'Cerrar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');

        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  cancelar(){
    this.estate = 0;
  }

  novedadesForm = new FormGroup({    
    tipo_novedad: new FormControl(''),
    detalles: new FormControl(''),

    dias: new FormControl(''),
    horas: new FormControl(''),
    minutos: new FormControl(''),

    correo: new FormControl(''),
  });

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async agregarNovedad(id_orden){

    var text = '';
    var sw = 0;
    var detalles = '';

    if(this.estate === 1){

      if(this.novedadesForm.value.detalles==='' || this.novedadesForm.value.detalles===null){
        text = 'Digite la novedad...';
        sw = 1;
      }else{
        detalles = this.novedadesForm.value.detalles;
      }

    }else if(this.estate === 2){

      if(this.novedadesForm.value.dias === '' || this.novedadesForm.value.horas === '' || this.novedadesForm.value.minutos === ''){
        text = 'Digite el tiempo de espera!';
        sw = 1;
      }else{
        detalles = this.novedadesForm.value.dias+','+this.novedadesForm.value.horas+','+this.novedadesForm.value.minutos;
      }

    }else if(this.estate === 3){

      if(this.novedadesForm.value.dias === '' || this.novedadesForm.value.horas === '' || this.novedadesForm.value.minutos === '' || this.novedadesForm.value.detalles===''){
        text = 'Digite los datos solicitados!';
        sw = 1;
      }else{
        detalles = this.novedadesForm.value.detalles+'&/()'+this.novedadesForm.value.horas+','+this.novedadesForm.value.minutos;        
      }

    }else if(this.estate === 4){
      
      if(this.novedadesForm.value.detalles==='' || this.novedadesForm.value.detalles===null){
        text = 'Digite los detalles del NO SHOW!';
        sw = 1;
      }else{
        detalles = this.novedadesForm.value.detalles;
      }

    }else if(this.estate === 5){

      if(this.novedadesForm.value.detalles==='' || this.novedadesForm.value.detalles===null){
        text = 'Digite los detalles de la novedad!';
        sw = 1;
      }else{
        detalles = this.novedadesForm.value.detalles;
      }

    }

    if(sw===1){
      
      const alert = await this.alertController.create({
        cssClass: 'alert-danger',
        header: 'Aotour Mobile Driver',
        mode: modal_mode,
        message: text,
        buttons: [
          {
            text: 'Cerrar',
          }
        ]
      });
      alert.present();

    }else{

      let loading = await this.loadinController.create({
        spinner: loading_var,
        mode: modal_mode
      });
    
      loading.present();

      var data = {
        user_id: this.id_usuario,
        tipo_novedad: this.estate,
        servicio_id: id_orden,
        detalles: detalles
      }
      
      this.http.post(this.url_server+'/api/v1/novedadesappv2', data, this.httpOptions).subscribe(async data => {
        
        if(data['response']===true){
          
          loading.dismiss();
          const toast = await this.toastController.create({
            message: 'Novedad Guardada!',
            color: 'primary',
            duration: 3000,
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

}
