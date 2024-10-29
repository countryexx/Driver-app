import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { url } from 'src/app/server';
import { loading_var, modal_mode } from 'src/app/vars';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  id_usuario:any;
  url_server:any;
  httpOptions:any;
  token:any;
  sms:any;

  constructor(private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private loadinController: LoadingController,
    private http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController) { 

      this.id_usuario = localStorage.getItem('id_usuario');
      this.url_server = url;
      this.token = localStorage.getItem('token');
      this.httpOptions = {
        headers: new HttpHeaders({ "Authorization": localStorage.getItem('token') },)
      };
      this.sms = 0;
      
    }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async mostrarOpciones(id){
    
    var nombre = localStorage.getItem('nombre_completo');
    var text1 = 'Hello. I am the driver '+nombre+'. Este es el mensaje 1.';
    var text2 = 'Hola. Soy el conductor '+nombre+'. Este es el mensaje 2.';
    var text3 = 'Hola. Soy el conductor '+nombre+'. Este es el mensaje 3.';
    var text4 = 'Hola. Soy el conductor '+nombre+'. Este es el mensaje 4.';

    const actionSheet = await this.actionSheetController.create({
    header: 'Mensajes',
    cssClass: 'my-custom-class',
    buttons: [{
      text: text1,
      role: 'destructive',
      icon: 'chatbox',
      handler: () => {
        this.enviarMensaje(id,text1);
      }
    }, {
      text: text2,
      icon: 'chatbox',
      handler: () => {
        this.enviarMensaje(id,text2);
      }
    }, {
      text: text3,
      icon: 'chatbox',
      handler: () => {
        this.enviarMensaje(id,text3);
      }
    }, {
      text: text4,
      icon: 'chatbox',
      handler: () => {
        this.enviarMensaje(id,text4);
      }
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        
      }
    }]
  });
  await actionSheet.present();

  const { role, data } = await actionSheet.onDidDismiss();
  console.log('onDidDismiss resolved with role and data', role, data);
    
  }

  async enviarMensaje(id, texto){

    let loading = await this.loadinController.create({
      spinner: loading_var,
      mode: modal_mode,
      cssClass: 'load',
      message: 'Enviando...'
    });
  
    loading.present();

    var data = {
      id: id,
      texto: texto
    }
    
    this.http.post(this.url_server+'/api/v1/mensaje', data, this.httpOptions).subscribe(async data => {
      
      if(data['respuesta']===true){
        
        loading.dismiss();

        const toast = await this.toastController.create({
          message: 'Mensaje Enviado!',
          color: 'success',
          position: 'bottom',
          mode: modal_mode,
          duration: 4000,
          buttons: [
            {
              side: 'start',
              icon: 'close',
            },
          ]
        });
        toast.present();

        this.sms = data['mensajes']
        console.log('Actualizar lista de mensajes con el último...')

      }else if(data['respuesta']===false){
        

      }        
    }, err => {
      loading.dismiss();
      this.errorAlert();
    });

    console.log('Mensaje enviado!!!');
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

}
