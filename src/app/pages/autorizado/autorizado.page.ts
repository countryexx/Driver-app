import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';

import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { url } from './../../server';
import { loading_var, modal_mode } from 'src/app/vars';

@Component({
  selector: 'app-autorizado',
  templateUrl: './autorizado.page.html',
  styleUrls: ['./autorizado.page.scss'],
})
export class AutorizadoPage implements OnInit {
  
  sw:any;
  scannedCode:any;

  id_usuario:any;
  url_server:any;
  httpOptions:any;
  constructor( private modalController: ModalController,
    private barcodeScanner: BarcodeScanner,
    private alertController: AlertController,
    private loadinController: LoadingController,
    private http: HttpClient) {
    this.sw = 0;

    this.id_usuario = localStorage.getItem('id_usuario');
    this.url_server = url;
    this.httpOptions = {
      headers: new HttpHeaders({ "Authorization": localStorage.getItem('token') },)
    };
    this.scannedCode = null;
  }

  ngOnInit() {
  }

  autorizadoForm = new FormGroup({
    cedula: new FormControl(''),
  });

  formValidator(): boolean {

    let data = '';

    if(this.autorizadoForm.value.cedula === ''){
      data +='<ion-icon name="alert-circle-sharp"></ion-icon> El campo Cédula es requerido <br>';
    }

    return false;
  }

  onSubmit(){

    if (this.formValidator()){
    }
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

  manual(){
    this.sw = 1;
  }

  volver(){
    this.sw = 0;
    this.autorizadoForm = new FormGroup({
      cedula: new FormControl(''),
    });
  }

  async agregar(id){

    let loading = await this.loadinController.create({
      spinner: loading_var,
      mode: modal_mode
    });
  
    loading.present();

    var data = {
      id_servicio: id,
      id_usuario: this.autorizadoForm.value.cedula
    }
    
    this.http.post(this.url_server+'/api/v1/autorizadoscan', data, this.httpOptions).subscribe(async data => {
      
      if(data['respuesta']==='duplicadop'){

        loading.dismiss();

        const alert = await this.alertController.create({
          cssClass: 'alert-danger',
          header: 'Aotour Mobile Driver',
          message: '¡ALERTA!<br><br> Este usuario ya está PROGRAMADO en esta ruta y no lo puedes volver a agregar.',
          mode: modal_mode,
          buttons: [
            {
              text: 'Cerrar',
            }
          ]
        });
        alert.present();

      }else if(data['respuesta']==='duplicadoa'){

        loading.dismiss();

        const alert = await this.alertController.create({
          cssClass: 'alert-danger',
          header: 'Aotour Mobile Driver',
          message: '¡Alerta!<br><br> el usuario digitado ya fue agregado como AUTORIZADO en esta ruta y no lo puedes volver a agregar.',
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

        const alert = await this.alertController.create({
          cssClass: 'alert-danger',
          header: 'Aotour Mobile Driver',
          message: '¡Muy bien! <br><br>El pasajero ha sido agreado como autorizado.',
          mode: modal_mode,
          buttons: [
            {
              text: 'Cerrar',
            }
          ]
        });

        this.autorizadoForm = new FormGroup({
          cedula: new FormControl(''),
        });

        alert.present();

      }else{
        
        loading.dismiss();

        const alert = await this.alertController.create({
          cssClass: 'alert-danger',
          header: 'Aotour Mobile Client',
          message: 'No se pudo guardar al pasajero. Por favor, inténtalo de nuevo.',
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

  async scanCode(id){
    
    let code = null;

    this.barcodeScanner.scan().then(async barcodeData => {
      this.scannedCode = barcodeData;

      code = JSON.stringify(this.scannedCode.text).replace(/['"]+/g, '');//parseInt(JSON.stringify(this.scannedCode.text));

      //code = '10430270001';
      
      if(code!=null && code!=''){
        //alert('Data escaneada: '+code)

        let loading = await this.loadinController.create({
          spinner: loading_var,
          mode: modal_mode
        });
      
        loading.present();

        var data = {
          id_servicio: id,
          id_usuario: code
        }
        
        this.http.post(this.url_server+'/api/v1/autorizadoscan', data, this.httpOptions).subscribe(async data => {
          
          if(data['respuesta']==='duplicadop'){

            loading.dismiss();
    
            const alert = await this.alertController.create({
              cssClass: 'alert-danger',
              header: 'Aotour Mobile Driver',
              message: '¡ALERTA!<br><br> Este usuario ya está PROGRAMADO en esta ruta y no lo puedes volver a agregar.',
              mode: modal_mode,
              buttons: [
                {
                  text: 'Cerrar',
                }
              ]
            });
            alert.present();
    
          }else if(data['respuesta']==='duplicadoa'){
    
            loading.dismiss();
    
            const alert = await this.alertController.create({
              cssClass: 'alert-danger',
              header: 'Aotour Mobile Driver',
              message: '¡Alerta!<br><br> el usuario digitado ya fue agregado como AUTORIZADO en esta ruta y no lo puedes volver a agregar.',
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
    
            const alert = await this.alertController.create({
              cssClass: 'alert-danger',
              header: 'Aotour Mobile Driver',
              message: '¡Muy bien! <br><br>El pasajero ha sido agreado como autorizado.',
              mode: modal_mode,
              buttons: [
                {
                  text: 'Cerrar',
                }
              ]
            });
    
            this.autorizadoForm = new FormGroup({
              cedula: new FormControl(''),
            });
    
            alert.present();
    
          }else{
            
            loading.dismiss();
    
            const alert = await this.alertController.create({
              cssClass: 'alert-danger',
              header: 'Aotour Mobile Client',
              message: 'No se pudo guardar al pasajero. Por favor, inténtalo de nuevo.',
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
          header: 'Aotour Mobile Client',
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

}
