import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ControlService {

  constructor(private alertController: AlertController) { }

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
}
