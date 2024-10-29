import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController, LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

import { Storage } from '@capacitor/storage';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { url } from './../../server';
import { loading_var, modal_mode } from 'src/app/vars';

export const FILE_KEY = 'files';

@Component({
  selector: 'app-fuec',
  templateUrl: './fuec.page.html',
  styleUrls: ['./fuec.page.scss'],
})
export class FuecPage implements OnInit {

  downloadUrl = '';
  myFiles = [];
  downloadProgress = 0;

  id_usuario:any;
  url_server:any;
  httpOptions:any;

  constructor(private http: HttpClient, 
    public toastController: ToastController, 
    public modalController: ModalController, 
    private loadinController: LoadingController, 
    private alertController: AlertController, 
    private fileOpener: FileOpener,
    private file: File) { 

      this.id_usuario = localStorage.getItem('id_usuario');
      this.url_server = url;
      this.httpOptions = {
        headers: new HttpHeaders({ "Authorization": localStorage.getItem('token') },)
      };
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

  async downloadFile(id) {

    const loading = await this.loadinController.create({
      spinner: loading_var,
      mode: modal_mode,
      message: 'Cargando documento...',
    });
    await loading.present();

    var data = {
      id: id
    }
    
    this.http.post(this.url_server+'/api/v1/exportarfuecpdfv2', data, this.httpOptions).subscribe(async data => {
      
      if(data['response']===true){

        this.downloadUrl = data['pdf'];

        var filename = 'fuec_'+id+'.pdf';

        this.saveAndOpenPdf(this.downloadUrl, filename);

        loading.dismiss();
        
      }
    }, err => {
      loading.dismiss();
      this.errorAlert();
    });
    //URL
  }
  //FIN DESCARGA DE ARCHIVOS

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

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
