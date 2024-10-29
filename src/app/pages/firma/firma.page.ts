import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import SignaturePad from 'signature_pad';
import { url } from './../../server';
import { CalificacionPage } from '../calificacion/calificacion.page';
import { Router } from '@angular/router';

import { TrackerService } from 'src/app/services/tracker.service';
import { loading_var, modal_mode } from 'src/app/vars';

@Component({
  selector: 'app-firma',
  templateUrl: './firma.page.html',
  styleUrls: ['./firma.page.scss'],
})
export class FirmaPage implements OnInit {

  @ViewChild('canvas', { static: true }) signaturePadElement;
  signaturePad: any;
  canvasWidth: number;
  canvasHeight: number;
  converted_image: any;
  recoger: any;
  servicio_activo: any;
  dejar: any;
  cliente: any;
  hora: any;

  id_usuario:any;
  url_server:any;
  httpOptions:any

  constructor(private elementRef: ElementRef,
    private modalController: ModalController,
    private alertController: AlertController,
    private loadinController: LoadingController,
    private http: HttpClient,
    private calificacion: CalificacionPage,
    private router: Router,
    private gps: TrackerService) { 

      this.id_usuario = localStorage.getItem('id_usuario');
      this.url_server = url;
      this.httpOptions = {
        headers: new HttpHeaders({ "Authorization": localStorage.getItem('token') },)
      };

    }

  ngOnInit(): void {
    this.init();
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.init();
  }

  init() {
    const canvas: any = this.elementRef.nativeElement.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 140;
    if (this.signaturePad) {
      this.signaturePad.clear(); // Clear the pad on init
    }
  }

  public ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
    this.signaturePad.clear();
    this.signaturePad.penColor = 'rgb(56,128,255)';
  }

  isCanvasBlank(): boolean {
    if (this.signaturePad) {
      return this.signaturePad.isEmpty() ? true : false;
    }
  }

  clear() {
    this.signaturePad.clear();
  }

  undo() {
    const data = this.signaturePad.toData();
    if (data) {
      data.pop();
      this.signaturePad.fromData(data);
    }
  }

  saves(id, calificacion_calidad, calificacion_actitud){

    alert(id+' , '+calificacion_calidad+' , '+calificacion_actitud)
    const img = this.signaturePad.toDataURL();
    this.converted_image = img;
  }

  async finalizarServicio(id, calificacion_calidad, calificacion_actitud){
    
    let loading = await this.loadinController.create({
      spinner: loading_var,
      mode: modal_mode
    });
  
    loading.present();

    var data = {
      id_servicio: id,
      imagen: this.signaturePad.toDataURL(),
      calificacionCalidad: calificacion_calidad,
      calificacionActitud: calificacion_actitud
    }
    
    this.http.post(this.url_server+'/api/v1/finalizarservicio', data, this.httpOptions).subscribe(async data => {
      
      if(data['respuesta']===true){

        loading.dismiss();
        
        this.servicio_activo = null;
        this.recoger = null;
        this.dejar = null;
        this.cliente = null;
        this.hora = null;

        //localStorage.removeItem('servicioGobal');
        //localStorage.removeItem('servicio_activo');

        localStorage.removeItem('dejar');
        localStorage.removeItem('recoger');
        localStorage.removeItem('pasajeros');
        localStorage.removeItem('hora');
        localStorage.removeItem('cliente');

        //this.gps.finalizarGPS(id);

        const alert = await this.alertController.create({
          cssClass: 'alert-danger',
          header: 'Aotour Mobile Driver',
          message: 'Servicio Finalizado!',
          backdropDismiss: false,
          mode: modal_mode,
          buttons: [
            {
              text: 'Cerrar',
              handler: () => {
                
                this.modalController.dismiss({
                  'dismissed': true
                });

              }
            }
          ]
        });

        this.modalController.dismiss({
          'dismissed': true
        });

        //window.location.reload();
        //this.dismiss();

        alert.present();

      }else if(data['respuesta']===false){
        
        loading.dismiss();
        const alert = await this.alertController.create({
          cssClass: 'alert-danger',
          header: 'Aotour Mobile Driver',
          message: 'Error en la finalización del servicio',
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

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true,
      'role': 1
    });
  }

}
