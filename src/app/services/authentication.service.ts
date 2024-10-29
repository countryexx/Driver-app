import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { Storage } from '@capacitor/storage';
const Stor = Storage;
import { BehaviorSubject, from, Observable } from 'rxjs';
const TOKEN_KEY = 'my-token';
import { map, tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { FcmService } from './fcm.service';

import { url } from './../server';
import { loading_var, modal_mode } from '../vars';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  datas:any;
  
  id_usuario:any;
  url_server:any;
  httpOptions:any;

  constructor(private http: HttpClient,
    private router: Router,
    private alertController: AlertController,
    private loadinController: LoadingController,
    private fcmService: FcmService) {

      this.id_usuario = localStorage.getItem('id_usuario');
      this.url_server = url;
      this.token = localStorage.getItem('token');
      this.httpOptions = {
        headers: new HttpHeaders({ "Authorization": this.token },)
      };

      this.loadToken();

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

    async loadToken(){

      const token = localStorage.getItem('token');

      if (token){
        console.log('set token: ', token);
        this.token = token;

        //
        var data = {
          id_usuario: this.id_usuario,
        }
        
        this.http.post(this.url_server+'/api/v1/actualizardatos', data, this.httpOptions).subscribe(async data => {
          
          if(data['respuesta']===true){

            localStorage.setItem('nombre_completo', data['conductor']['nombre_completo']);
            localStorage.setItem('foto', data['conductor']['foto_app']);

            this.isAuthenticated.next(true);
            console.log('logueado')
          }else if(data['respuesta']===false){
            this.isAuthenticated.next(false);
            console.log('no logueado')
          }
  
        }, err => {
          console.log(String(err)+ ' test');
  
          this.handleError(err)
        });
        //        
      }else{
        this.isAuthenticated.next(false);
      }

    }

    handleError(error: HttpErrorResponse) {

      if(error.status===401){

        localStorage.removeItem('nombre_completo')
        localStorage.removeItem('foto')
        localStorage.removeItem('id_usuario')
        localStorage.removeItem('tipo_usuario')
        localStorage.removeItem('token')

        console.log('no logueado 401 test');

        this.isAuthenticated.next(false);        

      }
      
    }

/*    async actualizarDatos(){

      //var server = 'http://localhost/autonet';
      var server = 'https://app.aotour.com.co/autonet';
      var xhr = new XMLHttpRequest();
      xhr.open("POST", server + "/api/v1/actualizardatos");
      
      xhr.setRequestHeader("Authorization", localStorage.getItem('token'));

      xhr.send();
      xhr.onload = async () => {

        if (xhr.status == 200) {
          
          let response = JSON.parse(xhr.responseText);

          if(response.respuesta===true){

            localStorage.setItem('nombre_completo',response.conductor.nombre_completo)
            localStorage.setItem('foto',response.conductor.foto_app)
            localStorage.setItem('id_usuario',response.id_usuario)
            //localStorage.setItem('tipo_usuario',response.tipo_usuario)

          }
          
        }
      }

    }*/
    
   async login(credentials: {username, password}){

    const loading = await this.loadinController.create({
      spinner: loading_var,
      mode: modal_mode
    });
    await loading.present();

    let httpOptions = null;

    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' },)
    };

    //FUNCIONAL START
    var server = url;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", server + "/oauth/accesstokenv2", true);
    xhr.withCredentials = false;
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    var requestParams = "grant_type=password&username=" + encodeURIComponent(credentials.username) + "&password=" + encodeURIComponent(credentials.password);
    
    xhr.send(requestParams);
    xhr.onload = async () => {
      if (xhr.status == 200) {
        let response = JSON.parse(xhr.responseText);
        console.log(response.acceso)

        if(response.acceso===true){

          loading.dismiss();          

          localStorage.setItem('nombre_completo',response.conductor.nombre_completo)
          localStorage.setItem('foto',response.conductor.foto_app)
          localStorage.setItem('id_usuario',response.id_usuario)
          localStorage.setItem('tipo_usuario',response.tipo_usuario)
          localStorage.setItem('token', response.response.token_type+' '+response.response.access_token)

          Stor.set({key: TOKEN_KEY, value: response.response.access_token})

          this.fcmService.initPush();

          this.isAuthenticated.next(true);
          this.router.navigateByUrl('/menu', { replaceUrl : true });

        }else if(response.mensaje===false){
          
          const alert = await this.alertController.create({
            header: 'Aotour Mobile Driver',
            mode: modal_mode,
            cssClass: 'alert-danger',
            message: response.respuesta,
            buttons: ['Cerrar'],
          });
          await loading.dismiss();
          alert.present();   
          
        }
        
      }else{
        loading.dismiss();
        this.errorAlert();
      }
    }
    //END FUNCIONAL
   }   

   logout(): Promise<void>{
    this.isAuthenticated.next(false);
    localStorage.removeItem('nombre_completo');
    localStorage.removeItem('foto');
    localStorage.removeItem('id_usuario');
    localStorage.removeItem('tipo_usuario');
    localStorage.removeItem('token');
    return Storage.remove({ key: TOKEN_KEY});
   }
}
