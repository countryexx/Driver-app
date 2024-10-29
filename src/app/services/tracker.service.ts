import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { url } from './../server';

@Injectable({
  providedIn: 'root'
})
export class TrackerService {

  id_usuario:any;
  url_server:any;
  httpOptions:any;
  locations: any;
  locations2: any;
  arr:any;
  array:any;
  token:any;
  id_servicio: any;
  id:any;

  constructor(private backgroundGeolocation: BackgroundGeolocation,
    private http: HttpClient) { 

    this.id_usuario = localStorage.getItem('id_usuario');
    this.url_server = url;
    this.token = localStorage.getItem('token');
    this.httpOptions = {
      headers: new HttpHeaders({ "Authorization": this.token },)
    };

    this.arr = [];
    this.array = [];
    this.locations = [];
    this.locations2 = [];
    this.id_servicio = localStorage.getItem('servicioGobal');
    

  }

  configBG(){    

    //BG
    const config: BackgroundGeolocationConfig = {

      desiredAccuracy: 10,
      stationaryRadius: 10,
      distanceFilter: 20,
      interval: 4000,
      fastestInterval: 4000,
      activitiesInterval: 4000,
      notificationTitle: 'Aotour Mobile Driver',
      notificationText: 'Seguimiento en proceso',
      notificationIconColor: '#4caf50',

      /*url: url+'/api/v1/iniciarserviciov2/'+this.id_servicio,
      httpHeaders: {
        'Authorization': 'Bearer dYJSVZUTAumSPQe6NwHaTwpzXND8O0DdN2nNlCsR',
      },
      postTemplate: {
        latitude: '11.1111',
        longitude:  '-74.4444',
        speed: '9',
      },
      //postTemplate: [12.4343, 45.58679950],*/

      debug: false, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
    };

    this.backgroundGeolocation.configure(config)
    .then(() => {

      this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {

        this.locations = location;

        this.arr.push(location);
        let value = this.arr.length;
        this.id = localStorage.getItem('servicioGobal');

        var parametros = {
          id_servicio: this.id,
          latitude: this.arr[value-1].latitude,
          longitude: this.arr[value-1].longitude,
          speed: this.arr[value-1].speed
        }
        
        this.http.post(this.url_server+'/api/v1/iniciarserviciov2', parametros, this.httpOptions).subscribe(data => {
          
          if(data['respuesta']===true){
    
          }else{
            //alert('Error al hacer conexión con la base de datos.')
          }
          
        }, err => {
          //console.log('SDGM ERROR : '+err.error);
          console.log(err);
        });

        //FIN VERSIÓN DE PRODUCCIÓN
        
      });

    });
    //BG

  }

  configuracionGPS(id) {
    this.configBG();
    this.backgroundGeolocation.start();
  }

  finalizarGPS(id) {
    this.backgroundGeolocation.stop();
  }
}