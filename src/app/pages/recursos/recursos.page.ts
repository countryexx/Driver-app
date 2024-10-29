import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { ApiImage } from 'src/app/services/api.service';
import { Platform, ActionSheetController } from '@ionic/angular';
//import { CameraSource, Plugins, CameraResultType } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { DomSanitizer } from '@angular/platform-browser';

import validator from 'validator';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { url } from './../../server';
import { loading_var, modal_mode } from 'src/app/vars';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.page.html',
  styleUrls: ['./recursos.page.scss'],
})
export class RecursosPage implements OnInit {

  images: ApiImage[] = [];
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  sw:any;
  id_usuario:any;
  url_server:any;
  httpOptions:any;
  image:any;
  loadings:any;
  imageData:any;
  converted_image: any;
  
  constructor(private modalController: ModalController,
    private loadinController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
    private http: HttpClient,
    private datepipe: DatePipe,
    private plt: Platform, 
    private actionSheetCtrl: ActionSheetController,
    private _sanitizer: DomSanitizer) {
      
      this.sw = 0;
      this.id_usuario = localStorage.getItem('id_usuario');
      this.url_server = url;
      this.httpOptions = {
        headers: new HttpHeaders({ "Authorization": localStorage.getItem('token') },)
      };
      const image = '';
      const loadings = this.loadinController.create({
        spinner: 'dots',
      });
      this.imageData = '';
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

  recursosForm = new FormGroup({    
    cliente: new FormControl(''),
    tipo: new FormControl(''),
    fecha: new FormControl(''),
    hora: new FormControl(''),
    novedades: new FormControl(''),
    placa: new FormControl(''),    
  });

  recursosFormValidator = {
    cliente: {empty:''},
    tipo: {empty:''},
    fecha: {empty:''},
    hora: {empty:''},
    novedades: {empty:''},
    placa: {empty:''},    
  }

  formValidator(): boolean {

    let data = '';

    if( validator.isEmpty(this.recursosForm.value.novedades) || validator.isEmpty(this.recursosForm.value.placa) ){//|| validator.isEmpty(this.recursosForm.value.userEmail) || validator.isEmpty(this.recursosForm.value.userPassword) || validator.isEmpty(this.recursosForm.value.userPasswordRepeat) || validator.isEmpty(this.recursosForm.value.userPhone) ) {

      if(validator.isEmpty(this.recursosForm.value.cliente)){
        data +='<ion-icon name="alert-circle-sharp"></ion-icon> El campo Cliente es requerido <br>';
      }

      if(validator.isEmpty(this.recursosForm.value.tipo)){
        data +='<ion-icon name="alert-circle-sharp"></ion-icon> El campo Tipo de Ruta es requerido <br>';
      }

      if(validator.isEmpty(this.recursosForm.value.fecha)){
        data +='<ion-icon name="alert-circle-sharp"></ion-icon> El campo Fecha es requerido <br>';
      }

      if(validator.isEmpty(this.recursosForm.value.hora)){
        data +='<ion-icon name="alert-circle-sharp"></ion-icon> El campo Hora es requerido <br>';
      }

      if(validator.isEmpty(this.recursosForm.value.novedades)){
        data +='<ion-icon name="alert-circle-sharp"></ion-icon> El campo Novedades es requerido <br>';
      }

      if(validator.isEmpty(this.recursosForm.value.placa)) {
        data +='<ion-icon name="alert-circle-sharp"></ion-icon> El campo Placa es requerido <br>';
      }

      var color = 'danger';

      this.validatorError(data,color);

      return false;
    }else{
      return true;
    }
    
  }

  onSubmit(){

    if (this.formValidator()){
      this.presentAlertConfirm();
    }
  }

  async presentAlertConfirm() {

    let loading = await this.loadinController.create({
      spinner: loading_var,
      mode: modal_mode
    });
  
    loading.present();

    let latest_date =this.datepipe.transform(this.recursosForm.value.fecha, 'yyyy-MM-dd');
    let latest_time =this.datepipe.transform(this.recursosForm.value.hora, 'HH:mm');

    var data = {
      tipo_ruta: this.recursosForm.value.tipo,
      hora: latest_time,
      fecha: latest_date,
      cliente: this.recursosForm.value.cliente,
      image: this.image.base64String,
      nombre_imagen: 'TEXTO DE IMAGEN',
      nombre_documento: 'VERIFICACIÓN DE RUTA',
      placa: this.recursosForm.value.placa,
      id_usuario: this.id_usuario,
      novedades: this.recursosForm.value.novedades
    }
    
    this.http.post(this.url_server+'/api/v1/gestiondocumental', data, this.httpOptions).subscribe(async data => {
      
      if(data['respuesta']===true){

        loading.dismiss();

        this.recursosForm.value.cliente = '';
        this.recursosForm.value.tipo = '';        
        this.recursosForm.value.fecha = '';
        this.recursosForm.value.hora = '';
        this.recursosForm.value.novedades = '';
        this.recursosForm.value.placa = '';

        this.sw = 0;

        this.recursosForm = new FormGroup({    
          cliente: new FormControl(''),
          tipo: new FormControl(''),
          fecha: new FormControl(''),
          hora: new FormControl(''),
          novedades: new FormControl(''),
          placa: new FormControl(''),    
        });

        const toast = await this.toastController.create({
          message: 'Reporte de foto Enviado!',
          color: 'primary',
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
    
        toast.present();
        
      }else if(data['respuesta']===false){
        
      }
    }, err => {
      loading.dismiss();
      this.errorAlert();
    });

  }

  async validatorError(data, color){

    const toast = await this.toastController.create({
      message: data,
      color: color,
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

  }

  async selectImageSource() {
    const buttons = [
      {
        text: 'Cámara',
        icon: 'camera',
        handler: () => {
          this.addImage(CameraSource.Camera);
        
          this.loadings.present();
        }
      },
      {
        text: 'Galería',
        icon: 'image',
        handler: () => {
          this.addImage(CameraSource.Photos);

          this.loadings.present();
        }
      }
    ];

    if (!this.plt.is('hybrid')) {
      buttons.push({
        text: 'Seleccione un Archivo',
        icon: 'attach',
        handler: () => {
          this.fileInput.nativeElement.click();
        }
      });
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Seleccione una opción',
      mode: modal_mode,
      buttons
    });
    await actionSheet.present();
  }

  async addImage(source: CameraSource) {

    this.image = await Camera.getPhoto({
      quality: 60,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source
    });    

    let loading = await this.loadinController.create({
      spinner: loading_var,
      mode: modal_mode
    });
  
    loading.present();

    setTimeout(() =>{
      this.sw = 1;
      loading.dismiss();
      this.converted_image = 'data:image/jpg;base64,'+this.image.base64String;
    },300)
    
  }

  cancelar(){
    this.sw = 0;
  }

  convertFileToDataURLviaFileReader(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
        var reader  = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.send();
}

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
