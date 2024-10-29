import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { url } from './../../server';

@Component({
  selector: 'app-usuariosescolares',
  templateUrl: './usuariosescolares.page.html',
  styleUrls: ['./usuariosescolares.page.scss'],
})
export class UsuariosescolaresPage implements OnInit {

  id_usuario:any;
  url_server:any;
  httpOptions:any;
  token: string;

  constructor(private modalController: ModalController, 
    private actionSheetController: ActionSheetController, 
    private loadinController: LoadingController,
    private alertController: AlertController,
    private http: HttpClient) { 

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
      mode: 'ios',
      buttons: [
        {
          text: 'Cerrar',
        }
      ]
    });
    alert.present();

  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async presentActionSheet(id, servicio) {

    const actionSheet = await this.actionSheetController.create({
      header: 'NOVEDAD',
      mode: 'ios',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'No Salió a Tiempo',
        icon: 'alarm',
        handler: () => {
          this.guardarNovedad(id, servicio, 1);
        }
      }, {
        text: 'Estudiante Incapacitado',
        icon: 'medkit',
        handler: () => {
          this.guardarNovedad(id, servicio, 2);
        }
      }, {
        text: 'Lo recogió el Acudiente',
        icon: 'people',
        handler: () => {
          this.guardarNovedad(id, servicio, 3);
        }
      }, {
        text: 'Cancelar',
        icon: 'arrow-back',
        role: 'cancel',
        handler: () => {
          
        }
      }]
    });
    await actionSheet.present();

  }

  async guardarNovedad(usuario, servicio, novedad){

    let loading = await this.loadinController.create({
      spinner: 'circular',
    });
  
    loading.present();

    var data = {
      id_servicio: servicio,
      usuario: usuario,
      novedad: novedad
    }
    
    this.http.post(this.url_server+'/api/v1/novedadc', data, this.httpOptions).subscribe(async data => {
      
      if(data['respuesta']===true){

        loading.dismiss();
        const alert = await this.alertController.create({
          cssClass: 'alert-danger',
          header: 'Aotour Mobile Driver',
          message: 'Novedad Guardada!.',
          mode: 'ios',
          buttons: [
            {
              text: 'Cerrar',
            }
          ]
        });
        alert.present();

      }else if(data['respuesta']===false){
        
        loading.dismiss();
        const alert = await this.alertController.create({
          cssClass: 'alert-danger',
          header: 'Aotour Mobile Driver',
          message: 'No se ingresó la novedad!.',
          mode: 'ios',
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

}
