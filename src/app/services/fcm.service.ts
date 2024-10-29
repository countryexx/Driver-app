import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';

 import { PushNotifications, Token, ActionPerformed, PushNotificationSchema } from '@capacitor/push-notifications';
 import { LocalNotifications, LocalNotificationSchema, PendingLocalNotificationSchema } from '@capacitor/local-notifications';
 import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { url } from './../server';
import { modal_mode } from '../vars';

 const PushNotification = PushNotifications;

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  arr:any;
  notification:any;
  notificationDelayInSeconds:string="";

  id_usuario:any;
  url_server:any;
  httpOptions:any;

  constructor(private router: Router, 
    private toastController: ToastController,
    private modalController: ModalController,
    private http: HttpClient,
    private alertController: AlertController) { 
      
      this.arr = [];
      this.notification = [];
      this.id_usuario = localStorage.getItem('id_usuario');
      //this.url_server = 'http://localhost/autonet';
      this.url_server = url;
      this.httpOptions = {
        headers: new HttpHeaders({ "Authorization": localStorage.getItem('token') },)
      };
  }

  public initPush() {
    console.log('Plataforma : '+Capacitor.platform)
    if (Capacitor.platform !== 'web'){
      this.registerPush();
      console.log('THIS PLATFORM IS ANDROID')
    }else{
      console.log('THIS PLATFORM IS WEB')
    }
  }

  private registerPush() {
    PushNotification.requestPermissions().then((permission) => {
      if (permission.receive) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotification.register();
        console.log('REGISTER PUSH REALIZADO')
      } else {
        // No permission for push granted
      }
    });
 
    PushNotification.addListener(
      'registration',
      (token: Token) => {

        var registrationId = JSON.stringify(token.value).replace(/['"]+/g, '');//JSON.stringify(token.value).replace('"', '');
        
        console.log('My token: ' + registrationId)

        var data = {
          id_usuario: this.id_usuario,
          registrationid: registrationId,
          device: Capacitor.platform
        }
        
        this.http.post(this.url_server+'/api/v1/guardaridregistration', data, this.httpOptions).subscribe(async data => {

          //if(data['version']===1){

            /*const alert = await this.alertController.create({
              cssClass: 'alert-danger',
              header: 'Aotour Mobile Driver',
              message: '¡Hay una actualización disponible!',
              backdropDismiss: false,
              mode: modal_mode,
              buttons: [
                {
                  text: 'Más tarde',
                  role: 'cancel',
                  cssClass: 'danger',
                  handler: (blah) => {
                    
                  }
                }, {
                  text: 'Actualizar',
                  cssClass: 'success',
                  handler: () => {
                    //location.href("https:://app.aotour.com.co/autonet");
                    window.location.href = "https://play.google.com/store/apps/details?id=com.aotour.driver&hl=es_CO&gl=US";
                  }
                }
              ]
            });
            alert.present();*/
    
          //}

        }, err => {
          console.log(err);
        });
      }
    );
 
    PushNotification.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });
 
    PushNotification.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));

        this.notification = notification;
        this.arr.push(notification);

        let value = this.arr.length;

        var not = this.arr[value-1].body;
        var title = this.arr[value-1].title;

        this.mostrarToast(not, title);
        //this.ScheduledNotification(not);
      }
    );
 
    PushNotification.addListener(
      'pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        if (data.detailsId) {
          this.router.navigateByUrl(`/home/${data.detailsId}`);
        }
      }
    );
  }

  async mostrarToast(notification,title){
    
    const toast = await this.toastController.create({
      header: title,
      message: notification,
      color: 'warning',
      mode: modal_mode,
      position: 'top',
      cssClass: 'toast',
      buttons: [
        {
          side: 'end',
          icon: 'close',
          handler: () => {
          }
        },
      ]
    });

    toast.present();

  }

  ScheduledNotification(bodys) {
    {
      //var delay = window.prompt("Ingresa la cantidad de segundos...");
      //this.notificationDelayInSeconds = delay;
      
      var options:LocalNotificationSchema={
        id: this.random(1000000, 9999999),
        smallIcon: "ic_stat_icon_config_sample",
        iconColor: '#0BE840',
        title: "Aotour Mobile Driver",
        body: bodys,
        summaryText: "Servicio Ejecutivo",
        largeBody: bodys,
        schedule: {at: new Date(new Date().getTime()+1 * 1000 )},
        extra: "Datos adicionales",
        sound: "fanfare.wav"
      }
      LocalNotifications.schedule({notifications:[options]}).then(() => {
        //console.log('La notificación aparecerá en 30 segundos.')
      })
    }
  }

  random(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

}
