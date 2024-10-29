import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Capacitor } from '@capacitor/core';

import { NovedadesPage } from '../novedades/novedades.page';

import { Storage } from '@capacitor/storage';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
export const FILE_KEY = 'files';
import { url } from './../../server';
import { loading_var, modal_mode } from 'src/app/vars';


@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  public fecha;
  public cards: any;
  public servicios: any;
  downloadUrl = '';
  myFiles = [];
  downloadProgress = 0;

  id_usuario:any;
  url_server:any;
  httpOptions:any;
  novedades:any;

  dia:any;
  mes:any;
  clear:any;

  constructor(private alertController: AlertController,
    private http: HttpClient,
    private modalController: ModalController, 
    private loadinController: LoadingController, 
    private toastController: ToastController, 
    private fileOpener: FileOpener,
    public datepipe: DatePipe,
    private file: File) {

    this.servicios = [];
    this.novedades = [];

    this.id_usuario = localStorage.getItem('id_usuario');
    this.url_server = url;
    this.dia = 0;
    this.mes = 0;
    this.clear = 1;
    this.httpOptions = {
      headers: new HttpHeaders({ "Authorization": localStorage.getItem('token') },)
    };
   }

  ngOnInit() {
  }

  dias(){
    this.mes = 0;
    this.dia = 1;
    this.clear = 0;
  }

  meses(){
    this.mes = 1;
    this.dia = 0;
    this.clear = 0;
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

  historialForm = new FormGroup({    
    fechad: new FormControl(''),
    fecham: new FormControl(''),
  });

  async buscarServicios(sw){    

    this.servicios = [];

    let loading = await this.loadinController.create({
      spinner: loading_var,
      mode: modal_mode
    });
  
    loading.present();
    
    let latest_date =this.datepipe.transform(this.historialForm.value.fechad, 'yyyy-MM-dd');
    let mes =this.datepipe.transform(this.historialForm.value.fecham, 'yyyy-MM');
    
    console.log(mes)

    var data = {
      id_usuario: this.id_usuario,
      fecha: latest_date,
      mes: mes
    }

    if(sw===1){
      var urlRequest = this.url_server+'/api/v2/buscarservicios';
    }else{
      var urlRequest = this.url_server+'/api/v2/buscarserviciosmes';
    }
    
    this.http.post(urlRequest, data, this.httpOptions).subscribe(async data => {
      
      if(data['respuesta']===true){
        
        loading.dismiss();
        this.servicios = data['servicios'];

      }else if(data['respuesta']===false){
        
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Sin resultados',
          color: 'danger',
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
    }, err => {
      loading.dismiss();
      this.errorAlert();
    });

  }

  async modalNovedades(id) {

    let loading = await this.loadinController.create({
      spinner: loading_var,
      mode:modal_mode
    });
  
    loading.present();
    
    var data = {
      servicio_id: id,
    }
    
    this.http.post(this.url_server+'/api/v1/cargarnovedades', data, this.httpOptions).subscribe(async data => {
      
      if(data['response']===true){

        const modal = await this.modalController.create({
          component: NovedadesPage,
          cssClass: 'my-custom-class',
          mode: modal_mode,
          componentProps: {
            'id': id,
            'novedades': data['novedad_app'],
          }
        });
        loading.dismiss();
        return modal.present();

      }else{

        const modal = await this.modalController.create({
          component: NovedadesPage,
          cssClass: 'my-custom-class',
          mode: modal_mode,
          componentProps: {
            'id': id,
            'novedades': null,
          }
        });
        return modal.present();
      }
    }, err => {
      loading.dismiss();
      this.errorAlert();
    });
    console.log('datas :'+this.novedades)    

  }

  async descargarConstancia(id) {

    const loading = await this.loadinController.create({
      spinner: loading_var,
      mode: modal_mode,
      message: 'Cargando documento...',
    });
    await loading.present();

    var data = {
      servicio_id: id
    }
    
    this.http.post(this.url_server+'/api/v1/descargarconstancia', data, this.httpOptions).subscribe(async data => {
      
      if(data['response']===true){

        this.downloadUrl = data['pdf'];

        var filename = 'constancia_'+id+'.pdf';

        this.saveAndOpenPdf(this.downloadUrl, filename);

        loading.dismiss();
        
      }
    }, err => {
      loading.dismiss();
      this.errorAlert();
    });
    
  }

  async saveAndOpenPdf(pdf: string, filename: string) {

    const savedFile = await Filesystem.writeFile({
      path: filename,
      data: pdf,
      directory: Directory.Documents,
    });
    
    const writeDirectory = Capacitor.platform = 'ios' ? this.file.dataDirectory : this.file.externalDataDirectory;
    this.file.writeFile(writeDirectory, filename, this.convertBase64ToBlob(pdf, 'data:application/pdf;base64'), {replace: true})
      .then(() => {
          this.fileOpener.open(writeDirectory + filename, 'application/pdf')
              .catch(() => {
                  console.log('Error opening pdf file');
              });
      })
      .catch(() => {
          console.error('Error writing pdf file');
      });
  }

  convertBase64ToBlob(b64Data, contentType): Blob {
    contentType = contentType || '';
    const sliceSize = 512;
    b64Data = b64Data.replace(/^[^,]+,/, '');
    b64Data = b64Data.replace(/\s/g, '');
    const byteCharacters = window.atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
         const slice = byteCharacters.slice(offset, offset + sliceSize);
         const byteNumbers = new Array(slice.length);
         for (let i = 0; i < slice.length; i++) {
             byteNumbers[i] = slice.charCodeAt(i);
         }
         const byteArray = new Uint8Array(byteNumbers);
         byteArrays.push(byteArray);
    }
   return new Blob(byteArrays, {type: contentType});
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
