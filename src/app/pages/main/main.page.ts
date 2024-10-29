import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

import { MenuController } from '@ionic/angular';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { ModalController } from '@ionic/angular';
import { ServiciosPage } from '../servicios/servicios.page';
import { HistorialPage } from '../historial/historial.page';
import { FuecPage } from '../fuec/fuec.page';
import { BioseguridadPage } from '../bioseguridad/bioseguridad.page';
import { ProgramadosPage } from '../programados/programados.page';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CalificacionPage } from '../calificacion/calificacion.page';
import { FcmService } from 'src/app/services/fcm.service';
import { TrackerService } from 'src/app/services/tracker.service';
import { url } from './../../server';
import { UsuariosescolaresPage } from '../usuariosescolares/usuariosescolares.page';
import { UsuariosPage } from '../usuarios/usuarios.page';
import { LecturaqrPage } from '../lecturaqr/lecturaqr.page';
import { AsistenciaPage } from '../asistencia/asistencia.page';
import { loading_var, modal_mode } from 'src/app/vars';
import { ChatPage } from '../chat/chat.page';

declare var google;

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

    public cards: any;
    public servicios: any;
    scannedCode = null;
    total:number;
    public toast;

    id_usuario:any;
    url_server:any;
    httpOptions:any;
    servicioss:any;
    recoger:any;

    placeNavigate:any;

    @ViewChild('map', { static: false }) mapElement: ElementRef;
    map: any;
    address: string;
    currentMapTrack = null;
    marker = null;
    image = null;

    latitude: number;
    longitude: number;

    selectedPath = '';
    locations: any;
    locations2: any;
    arr:any;
    array:any;
    token:any;

    servicio_activo:any;
    pasajero_recogido:any;
    tipo_servicio:any;
    deshabilitar:any;
    dejar: any;
    hora: any;
    cliente: any;
    id: any;
    opcion_programados:any;
    pasajeros: any;
    esconderdatos:any;
    placeMarker:any;
    
  constructor(private router: Router, 
    private authService: AuthenticationService, 
    private menu: MenuController, 
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder, 
    public modalController: ModalController, 
    private loadinController: LoadingController, 
    private backgroundGeolocation: BackgroundGeolocation, 
    private barcodeScanner: BarcodeScanner, 
    public toastController: ToastController,
    public alertController: AlertController,
    private http: HttpClient,
    private fcmService: FcmService,
    private gps: TrackerService,
    private actionSheetController: ActionSheetController) {
      
      this.id_usuario = localStorage.getItem('id_usuario');
      this.url_server = url;
      this.token = localStorage.getItem('token');
      this.httpOptions = {
        headers: new HttpHeaders({ "Authorization": this.token },)
      };
      this.fcmService.initPush();
            
      this.deshabilitar = 0;
      this.esconderdatos = 0;//ESCONDER DATOS DEL SERVICIO
      
      this.servicioActivo();
      
      this.locations = [];
      this.locations2 = [];
      this.arr = [];
      this.array = [];
      this.total = 0;

      this.router.events.subscribe((event: RouterEvent) => {
        this.selectedPath = event.url;
      });      
/*
      setInterval(()=> {
            
        var parametros = {
          id_servicio: this.id,
          latitude: 1010,
          longitude: 2020,
          speed: 5.2
        }
        
        this.http.post(this.url_server+'/api/v1/iniciarserviciov2', parametros, this.httpOptions).subscribe(async data => {
          
          if(data['respuesta']===true){
            
            console.log('true');
    
          }
          
        }, err => {
          console.log(err);
        });

      }, 2000)*/

    }

    async servicioActivo(){

      /*let loading = await this.loadinController.create({
        spinner: loading_var,
        mode: modal_mode
      });
    
      loading.present();*/

      //SERVICIO ACTIVO
      var data = {
        id_usuario: this.id_usuario
      }
      
      this.http.post(this.url_server+'/api/v2/servicioactivo', data, this.httpOptions).subscribe(async data => {
        
        if(data['response']===true){

          var service = '';
          if(data['servicio']['ruta']===1){
            service = 'una RUTA ACTIVA';
          }else{
            service = 'un SERVICIO ACTIVO';
          }
       
          const toast = await this.toastController.create({
            message: 'Tiene '+service+'!',
            color: 'warning ',
            position: 'top',
            mode: modal_mode,
            duration: 8000,
            buttons: [
              {
                side: 'start',
                icon: 'close',
              },
            ]
          });
      
          toast.present();
          this.servicio_activo = 'activo';
          localStorage.setItem('servicioGobal', data['servicio']['id']);

          this.tipo_servicio = data['servicio']['ruta'];
          localStorage.setItem('tipo_servicio', data['servicio']['ruta']);

          if(data['servicio']['recoger_pasajero']===null && data['servicio']['ruta']!=1){
            this.pasajero_recogido = 'enabled';
          }else{
            this.pasajero_recogido = 'disabled';
          }          

          this.cliente = data['servicio']['centrodecosto']['razonsocial'];
          this.recoger = data['servicio']['recoger_en'];
          this.dejar = data['servicio']['dejar_en'];
          this.hora = data['servicio']['hora_servicio'];
          this.id = data['servicio']['id'];          
          
          var paxArray = data['servicio']['pasajeros'].split("/",); 
          
          var htmlPax = '';
          
          for (var i in paxArray) {
            var pax = paxArray[i].split(',');
            
            if (pax[0]!='') {
              htmlPax += pax[0].toUpperCase()+' / ';
            }
          }
          this.pasajeros = data['servicio']['pasajeros'];
          
          console.log(data['servicio']['recoger_en'])
          
          this.gps.configuracionGPS(this.id);

        }else if(data['response']===false){
          this.opcion_programados = 1;

          localStorage.removeItem('servicioGobal');
          localStorage.removeItem('servicio_activo');

          localStorage.removeItem('cliente');
          localStorage.removeItem('tipo_servicio');
          localStorage.removeItem('recoger');
          localStorage.removeItem('hora');
          localStorage.removeItem('pasajeros');
          localStorage.removeItem('dejar');
          //loading.dismiss();
        }
      }, err => {
        //loading.dismiss();
        console.log(err);
        //SACAR AL USUARIO AL LOGIN EN EL CODIGO 401 (SIN TOKEN)
      });   

    }

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
    configuracionGPS() {
      
      const config: BackgroundGeolocationConfig = {

        desiredAccuracy: 1,
        stationaryRadius: 1,
        distanceFilter: 1,
        interval: 1000,
        fastestInterval: 2000,
        activitiesInterval: 4000,
        notificationTitle: 'Aotour Mobile Driver',
        notificationText: 'Seguimiento en proceso',
        notificationIconColor: '#4caf50',

        debug: true, //  enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      };

      this.backgroundGeolocation.configure(config)
      .then(() => {

        this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
          
          /*VERSIÓN DE PRUEBA
          this.locations = location;

          this.arr.push(location);
          let value = this.arr.length;
          console.log('AURA GÓMEZ: '+value);

          var data = {
            lat: this.arr[value-1].latitude,
            lng: this.arr[value-1].longitude,
            speed: this.arr[value-1].speed
          };

          this.array.push(data);
          this.locations = JSON.stringify(this.array);

          localStorage.setItem("location", this.locations);
          localStorage.setItem("locations", this.locations);
          VERSIÓN DE PRUEBA*/


          //VERSION DE PRODUCCIÓN
          this.locations = location;

          this.arr.push(location);
          let value = this.arr.length;

          var parametros = {
            id_servicio: this.id,
            latitude: this.arr[value-1].latitude,
            longitude: this.arr[value-1].longitude,
            speed: this.arr[value-1].speed
          }
          
          this.http.post(this.url_server+'/api/v1/iniciarserviciov2', parametros, this.httpOptions).subscribe(async data => {
            
            if(data['respuesta']===true){
              
              //console.log();
      
            }else{
              alert('Error al hacer conexión con la base de datos.')
            }
            
          }, err => {
            console.log(err);
          });

          //FIN VERSIÓN DE PRODUCCIÓN

          // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
          // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
          // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
          //this.backgroundGeolocation.finish(); // FOR IOS ONLY
        });

      });
    }

    async logout() {
      
      const loading = await this.loadinController.create({
        spinner: null,
        duration: 5000,
        message: 'Click the backdrop to dismiss early...',
        translucent: true,
        cssClass: 'custom-class custom-loading',
        backdropDismiss: true
      });
      await loading.present();

    }
  
    ngOnInit() {
      this.loadMap(); //UTILIZADO ACTUALMENTE
      //this.update();
    }

    esconder(){
      this.esconderdatos = 1;
    }

    mostrarDatos(){
      this.esconderdatos = 0;
    }

    async ServicioStared(){

      if(this.servicio_activo==='activo'){
        const toast = await this.toastController.create({
          message: '¡EN SERVICIO!',
          color: 'primary',
          position: 'top',
          cssClass: 'yourCssClassName '
        });
    
        toast.present();
      }
    }

    async ServicioFinished(){

      if(this.servicio_activo!='activo'){
    
        this.toast.dismiss();
      
    }
  }

    async abrirModal() {

      const modal = await this.modalController.create({
        component: HistorialPage,
        cssClass: 'my-custom-class',
        mode: modal_mode,
        componentProps: {
          'data': this.servicios,
        }
      });

      setTimeout(() => {
        return modal.present();
      }, 3000);

    }
  
    async loadMap() {
      this.geolocation.getCurrentPosition().then(async (resp) => {
  
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
        
        var polylineOptions = {
          strokeColor: "#4caf50",
          strokeOpacity: 0.9,
          strokeWeight: 5,
        };

        let directionsService = new google.maps.DirectionsService();
        let directionsDisplay = new google.maps.DirectionsRenderer({
          suppressMarkers: true,
          polylineOptions: polylineOptions,
        });

        let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        let mapOptions = {
          center: latLng,
          zoom: 17,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true
        }
  
        this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
  
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        this.addMarker(this.map);
  
        this.map.addListener('dragend', () => {
  
          this.latitude = this.map.center.lat();
          this.longitude = this.map.center.lng();
  
          //this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())

        });
/*
        //test
        directionsDisplay.setMap(this.map);

        var start = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        
        var end = new google.maps.LatLng(10.927951, -74.799234);

        var waypts = [];

        var stop2 = new google.maps.LatLng(11.016265, -74.815402)
        var stop3 = new google.maps.LatLng(10.996101, -74.808821)
        var stop = new google.maps.LatLng(11.024332, -74.807763)

        //1. Declaring an empty array
        let actionLinks=[];

        let usuarios = JSON.parse(localStorage.getItem('pasajerosRuta'));
        for (let i = 0; i < usuarios.length; i++) {

          actionLinks.push({
            text: usuarios[i]['fullname'],
            icon: 'navigate',
            handler: () => {
              //acción al presionar al usuario
              
              //let coords = this.geocoder(usuarios[i]['address']);

              //geocoder
              let options: NativeGeocoderOptions = {
                useLocale: true,
                maxResults: 5
              };

              this.nativeGeocoder.forwardGeocode(usuarios[i]['address'], options)
                .then((result: NativeGeocoderResult[]) => 
                  this.placeMarker = result[0].latitude+','+result[0].longitude
                )
                .catch((error: any) => console.log(error));
              //geocoder
              //uy

              this.createMarker(2,end); //Creación de Marcador final (Bandera)

              let num = JSON.parse(localStorage.getItem('pasajerosRuta'));
              for (let i = 0; i < num.length; i++) {
                console.log(num[i]['address'])
                
                if(usuarios[i]!=num[i]){

                  //Creación de Markers Waypoints

                  //let coordss = this.geocoder(usuarios[i]['address']);
                  //

                  //geocoder
                  let options: NativeGeocoderOptions = {
                    useLocale: true,
                    maxResults: 5
                  };

                  this.nativeGeocoder.forwardGeocode(usuarios[i]['address'], options)
                    .then((result: NativeGeocoderResult[]) => 
                      this.placeMarker = result[0].latitude+','+result[0].longitude
                    )
                    .catch((error: any) => console.log(error));
                  //geocoder

                  this.createMarker(1,this.placeMarker);

                  waypts.push({
                    location: usuarios[i]['address']+', Barranquilla',
                    stopover: true
                  });
                  //Creación de Markers Waypoints

                }

              }


              var request = {
                origin: start,
                destination: usuarios[i]['address'],
                waypoints: waypts,
                optimizeWaypoints:true,
                provideRouteAlternatives: false,
                travelMode: 'DRIVING'
              };
              directionsService.route(request, function(response, status) {
                if (status == 'OK') {
                  directionsDisplay.setDirections(response);
                }
              });

              
              //test

            }
          })
        
        }

        actionLinks.push({
          text: 'No enrutar',
          icon: 'close',
          role: 'cancel',
          handler: () => {

          }
        })
        
        const actionSheet = await this.actionSheetController.create({
        header: 'Seleccionar Último Usuario...',
        backdropDismiss: false,
        buttons: actionLinks
        
        });
        await actionSheet.present();

        //console.log(num.length)
        */

        this.marker.addListener("click", () => {
          this.map.setZoom(8);
          this.map.setCenter(this.marker.getPosition());
        });
  
      }).catch((error) => {
        console.log('Error getting location', error);
      });

      let options = { maximumAge: 3000, timeout: 30000, enableHighAccuracy: true };
  
      let watch = this.geolocation.watchPosition(options);
      watch.subscribe((data) => {
  
        this.locations = data;
        let MyLG = new google.maps.LatLng(this.locations.coords.latitude, this.locations.coords.longitude);
        this.marker.setPosition(MyLG);
        this.map.setCenter(MyLG);
        
      });
    }

    geocoder(direccion){

      //geocoder
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };

      this.nativeGeocoder.forwardGeocode(direccion, options)
        .then((result: NativeGeocoderResult[]) => 
          this.placeMarker = result[0].latitude+','+result[0].longitude
        )
        .catch((error: any) => console.log(error));
      //geocoder

      return this.placeMarker

    }

    createMarker(sw, latlng) {
      
      if(sw===2){
        var urlImage = 'marker_bandera.png';
        var uno = 50;
        var dos = 45;
      }else{
        var urlImage = 'marker_pasajero.png';
        var uno = 35;
        var dos = 50;
      }

      this.image={
        url: 'assets/'+urlImage,
        scaledSize: new google.maps.Size(uno, dos),
      };

      var marker = new google.maps.Marker({
        position: latlng,
        map: this.map,
        icon: this.image,
        scaledSize: new google.maps.Size(85, 85),
      });

    }
  
    addMarker(map:any){

      this.image={
        url: 'assets/marker.png',
        scaledSize: new google.maps.Size(85, 85),
      };

      this.marker = new google.maps.Marker({
        map: map,
        icon: this.image,
        animation: google.maps.Animation.DROP,
        position: map.getCenter()
      });
    }
  
    calculo(){

      var resultArray = JSON.parse(localStorage.getItem('locations'));
      
      this.total = 0;

      for (var i=0; i<resultArray.length; i++) {

        if( (i+1) < resultArray.length){
          
          var value = this.getKilometros(resultArray[i].lat, resultArray[i].lng, resultArray[i+1].lat, resultArray[i+1].lng);
          
          this.total = (this.total) + parseFloat(value);

        }

      }

      alert("La distancia recorrida fue: "+this.total+" KILOMETROS");

    }
  
    getKilometros = function(lat1,lon1,lat2,lon2) {
      
      const rad = function(x) {return x*Math.PI/180;}
      var R = 6378.137; //Radio de la tierra en km
      var dLat = rad( lat2 - lat1 );
      var dLong = rad( lon2 - lon1 );
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;

      return d.toFixed(3); //Retorna tres decimales

    }
  
    redrawPath(path){

      if(this.currentMapTrack) {
        this.currentMapTrack = null;
      }
      
      if(path.length > 1) {
        
        this.currentMapTrack = new google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: '#0AE53F',
          strokeOpacity: 1.0,
          strokeWeight: 3
        });

        this.currentMapTrack.setMap(this.map);
      }
    }
  
    showHistoryRoute(){

      this.locations = localStorage.getItem('locations');

      var resultArray = JSON.parse(localStorage.getItem('locations'));
      var triangleCoordsLS12 = [];

      for (var i=0; i<resultArray.length; i++) {
        triangleCoordsLS12[i] = new google.maps.LatLng( resultArray[i].lat, resultArray[i].lng);
      }

      this.redrawPath(triangleCoordsLS12);
    }

    hideHistoryRoute(){
      this.currentMapTrack = null;
    }
  
    recorrer(){
    /*
      this.locations = [{lat: 35.548852, lng: 139.784086, speed: 0.98786876},{lat: 35.548852, lng: 139.784086, speed: 0.98786876},{lat: 21.324513, lng: -157.925074, speed: 0.98786876}]
      //this.locations =     
      for (var a = 0; a < this.locations.length; a++) {
        alert("Speed: "+this.locations[a].speed);
      }
      //alert('hola mundo '+this.locations.length)
      //localStorage.setItem("location", JSON.stringify(this.locations));

      localStorage.setItem("location", JSON.stringify(this.locations));
      */

      //NUEVO

      //this.locations2 = [{"latitude": "10.999110", "longitude": "-74.788672", "speed": "0.98786876"},{"latitude": "10.997593", "longitude": "-74.789970", "speed": "0.98786876"},{"latitude": "10.998678", "longitude": "-74.791289", "speed": "0.98786876"}]
      this.locations2 = [{"latitude": "10.997260", "longitude": "-74.800704", "speed": "0.98786876"},{"latitude": "10.995933", "longitude": "-74.801949", "speed": "0.98786876"},{"latitude": "10.993858", "longitude": "-74.803054", "speed": "0.98786876"},{"latitude": "10.995090", "longitude": "-74.805146", "speed": "0.98786876"},{"latitude": "10.997302", "longitude": "-74.803880", "speed": "0.98786876"},{"latitude": "10.998903", "longitude": "-74.805135", "speed": "0.98786876"}]

      for (var a = 0; a < this.locations2.length; a++) {
        var data = {
          lat: this.locations2[a].latitude,
          lng: this.locations2[a].longitude,
          speed: this.locations2[a].speed
        };
        
        this.array.push(data);
        this.locations = JSON.stringify(this.array);

      }

      localStorage.setItem("locations", this.locations);

      this.locations2 = localStorage.getItem("locations");
      //this.showHistoryRoute();

    }
  
    async getLocations(){
      
      this.locations2 = localStorage.getItem("locations"); //CONVERTIR DE ARRAY A OBJETO (OBTENER LA LONGITUD Y PODER ACCEDER A LAS PROPIEDADES)

      alert(this.locations2)

    }
  
    clearLocations(){
      localStorage.removeItem('locations');
    }
  
    getAddressFromCoords(lattitude, longitude) {
      console.log("getAddressFromCoords " + lattitude + " " + longitude);
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };

      this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
        .then((result: NativeGeocoderResult[]) => {
          this.address = "";
          let responseAddress = [];
          for (let [key, value] of Object.entries(result[0])) {
            if (value.length > 0)
              responseAddress.push(value);

          }
          responseAddress.reverse();
          for (let value of responseAddress) {
            this.address += value + ", ";
          }
          this.address = this.address.slice(0, -2);
        })
        .catch((error: any) => {
          this.address = "Address Not Available!";
        });

    }
  
    openFirst() {
      this.menu.enable(true, 'first');
      this.menu.open('first');
    }
  
    openEnd() {
      this.menu.open('end');
    }
  
    openCustom() {
      this.menu.enable(true, 'custom');
      this.menu.open('custom');
    }
  
    async presentModal() {

      let loading = await this.loadinController.create({
        spinner: loading_var,
        mode: modal_mode
      });
    
      loading.present();

      const modal = await this.modalController.create({
        component: ServiciosPage,
        cssClass: 'my-custom-class',
        mode: modal_mode,
        componentProps: {
          'data': this.cards,
        }
      });

      setTimeout(() => {
        loading.dismiss();
        return modal.present();
      }, 3000);    
    }
  
    async fuecModal() {
      
      let loading = await this.loadinController.create({
        spinner: loading_var,
        mode: modal_mode
      });
    
      loading.present();

      const modal = await this.modalController.create({
        component: FuecPage,
        cssClass: 'my-custom-class',
        mode: modal_mode
      });

      setTimeout(() => {
        loading.dismiss();
        return modal.present();
      }, 3000);
    }
  
    async bioseguridadModal() {

      let loading = await this.loadinController.create({
        spinner: loading_var,
        mode: modal_mode
      });
    
      loading.present();

      const modal = await this.modalController.create({
        component: BioseguridadPage,
        cssClass: 'my-custom-class',
        mode: modal_mode
      });

      setTimeout(() => {
        loading.dismiss();
        return modal.present();
      }, 3000);

    }
  
    dismiss() {
      this.modalController.dismiss({
        'dismissed': true
      });
    }

    handleError(error: HttpErrorResponse) {

      if(error.status===401){
        this.router.navigateByUrl('/login', { replaceUrl : true });

        localStorage.removeItem('nombre_completo')
        localStorage.removeItem('foto')
        localStorage.removeItem('id_usuario')
        localStorage.removeItem('tipo_usuario')
        localStorage.removeItem('token')

      }

      console.log(error.status+' Errorsss')

      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
      }
      
    };

    async serviciosProgramados() {

      let loading = await this.loadinController.create({
        spinner: loading_var,
        mode: modal_mode
      });
      
      loading.present();

      var data = {
        id_usuario: this.id_usuario,
      }
      
      this.http.post(this.url_server+'/api/v1/serviciospendientes', data, this.httpOptions).subscribe(async data => {
        
        if(data['respuesta']===true){
          loading.dismiss();
          const modal = await this.modalController.create({
            component: ProgramadosPage,
            cssClass: 'my-custom-class',
            mode: modal_mode,
            componentProps: {
              'data': data['servicios'],
            }
          });

          modal.onDidDismiss().then((data) => {
            
            //if(localStorage.getItem('servicioGobal')!=null){

            if(data['data']['role']!=1){

              this.servicio_activo = 'activo';

              this.tipo_servicio = parseInt(localStorage.getItem('tipo_servicio'));

              if(this.tipo_servicio != 1){
                this.pasajero_recogido = 'enabled';
              }else{
                this.pasajero_recogido = 'disabled';
              }

              this.cliente = localStorage.getItem('cliente');
              this.recoger = localStorage.getItem('recoger');
              this.dejar = localStorage.getItem('dejar');
              this.hora = localStorage.getItem('hora');
              this.id = localStorage.getItem('servicioGobal');
              this.pasajeros = localStorage.getItem('pasajeros');
              
            }

            //}
          });
          
          return modal.present();
  
        }else if(data['respuesta']===false){
          
          loading.dismiss();
          const alert = await this.alertController.create({
            cssClass: 'alert-danger',
            mode: 'ios',
            header: 'Aotour Mobile Driver',
            message: 'No tiene servicios programados',
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

      async recogerPasajero(id){

        let loading = await this.loadinController.create({
          spinner: loading_var,
          mode: modal_mode
        });
      
        loading.present();

        this.geolocation.getCurrentPosition().then((resp) => {
  
          this.latitude = resp.coords.latitude;
          this.longitude = resp.coords.longitude;

          //alert(resp.coords.latitude+' , '+resp.coords.longitude)

          var data = {
            servicio_id: id,
            latitude: resp.coords.latitude,
            longitude: resp.coords.longitude
          }
          
          this.http.post(this.url_server+'/api/v2/recogerpasajero', data, this.httpOptions).subscribe(async data => {
            
            if(data['response']===true){
      
              loading.dismiss();
              
              this.pasajero_recogido = 'disabled';

              var toast = null;
              toast = await this.toastController.create({
                message: 'Pasajero Recogido!',
                color: 'tertiary',
                position: 'bottom',
                mode: modal_mode,
                buttons: [
                  {
                    icon: 'close',
                    role: 'cancel',
                    side: 'start'
                  }
                ]
              });
              toast.present();
      
            }
          }, err => {
            loading.dismiss();
            this.errorAlert();
          });

        }).catch((error) => {
          console.log('Error getting location', error);
        });

      }

      async preguntarFinalizar(id, tipodeservicio){

        var toast = null;
        toast = await this.toastController.create({
          message: 'Confirma la Finalización del Servicio?',
          color: 'danger',
          mode: modal_mode,
          buttons: [
            {
              side: 'end',
              text: 'Si',
              handler: () => {
                if(tipodeservicio===1){
                  this.finalizarRuta(id, tipodeservicio);
                }else{
                  this.mostrarCalificacion(id);
                }
              }
            }, {
              text: 'No',
              icon: 'done',
              role: 'cancel',
              handler: () => {
                //this.deshabilitar = 0;
              }
            }
          ]
        });
        toast.present();
        //this.deshabilitar = 1;
      }

      async mostrarCalificacion(id){

        let loading = await this.loadinController.create({
          spinner: loading_var,
          mode: modal_mode
        });
      
        loading.present();
    
        const modal = await this.modalController.create({
          component: CalificacionPage,
          cssClass: 'my-custom-class',
          mode: modal_mode,
          componentProps: {
            'id': id,
          }
        });

        modal.onDidDismiss().then( async (data) => {

          if(data['data']['role']!=1){

            let loadingg = await this.loadinController.create({
              spinner: loading_var,
              mode: modal_mode
            });
          
            loadingg.present();

            this.servicio_activo = null;
            this.recoger = null;
            this.dejar = null;
            this.cliente = null;
            this.hora = null;
            this.tipo_servicio = null;
            this.gps.finalizarGPS(id);
            this.opcion_programados = 1;

            localStorage.removeItem('servicioGobal');
            localStorage.removeItem('servicio_activo');

            localStorage.removeItem('cliente');
            localStorage.removeItem('tipo_servicio');
            localStorage.removeItem('recoger');
            localStorage.removeItem('hora');
            localStorage.removeItem('pasajeros');
            localStorage.removeItem('dejar');

            setTimeout(() => {
              loadingg.dismiss();
            }, 800);
            
          }
          
        });
    
        setTimeout(() => {
          loading.dismiss();
          return modal.present();
        }, 500);

      }

      async finalizarRuta(id, ruta){

        let loading = await this.loadinController.create({
          spinner: loading_var,
          mode: modal_mode
        });
      
        loading.present();

        var data = {
          servicio_id: id,
          ruta: ruta
        }
        
        this.http.post(this.url_server+'/api/v2/finalizarservicio', data, this.httpOptions).subscribe(async data => {
          
          if(data['response']===true){

            loading.dismiss();
            
            const alert = await this.alertController.create({
              cssClass: 'alert-danger',
              header: 'Aotour Mobile Driver',
              message: 'Ruta Finalizada!',
              mode: 'ios',
              buttons: [
                {
                  text: 'Cerrar',
                }
              ]
            });
            this.servicio_activo = null;
            this.recoger = null;
            this.dejar = null;
            this.cliente = null;
            this.hora = null;
            this.tipo_servicio = null;
            this.gps.finalizarGPS(id);
            this.opcion_programados = 1;
            //this.gps.endService(id);

            localStorage.removeItem('cliente');
            localStorage.removeItem('servicioGobal');
            localStorage.removeItem('servicio_activo');
            localStorage.removeItem('tipo_servicio');
            localStorage.removeItem('recoger');
            localStorage.removeItem('hora');
            localStorage.removeItem('pasajeros');
            localStorage.removeItem('dejar');

            alert.present();

          }else{
            
            loading.dismiss();
            const alert = await this.alertController.create({
              cssClass: 'alert-danger',
              header: 'Aotour Mobile Driver',
              mode: 'ios',
              message: 'Error en la finalización del servicio',
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

      async finalizarServicio(id) {

        let loading = await this.loadinController.create({
          spinner: loading_var,
          mode: modal_mode
        });
      
        loading.present();

        var data = {
          id_servicio: id,
          //imagen: null,
          calificacionCalidad: 5,
          calificacionActitud: 5
        }
        
        this.http.post(this.url_server+'/api/v1/finalizarservicio', data, this.httpOptions).subscribe(async data => {
          
          if(data['respuesta']===true){

            loading.dismiss();
            
            const alert = await this.alertController.create({
              cssClass: 'alert-danger',
              header: 'Aotour Mobile Driver',
              message: 'Servicio Finalizado!',
              mode: 'ios',
              buttons: [
                {
                  text: 'Cerrar',
                }
              ]
            });
            this.servicio_activo = null;
            this.recoger = null;
            this.dejar = null;
            this.cliente = null;
            this.hora = null;
            alert.present();
            this.backgroundGeolocation.stop();

          }else if(data['respuesta']===false){
            
            loading.dismiss();
            const alert = await this.alertController.create({
              cssClass: 'alert-danger',
              header: 'Aotour Mobile Driver',
              message: 'Error en la finalización del servicio',
              mode: 'ios',
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

      async endService(){

        let loading = await this.loadinController.create({
          spinner: loading_var,
          mode: modal_mode
        });
      
        loading.present();

        const toast = await this.toastController.create({
          message: 'Servicio Finalizado!',
          color: 'secondary',
          mode: modal_mode,
          duration: 2500,
          buttons: [
            {
              side: 'end',
              text: 'CERRAR',
            }
          ]
        });        
        
        setTimeout(() => {

          loading.dismiss();
          localStorage.setItem('servicio_activo',null);
          this.servicio_activo = null;
          this.modalController.dismiss({
            'dismissed': true
          });
          toast.present();
        }, 3000);
      }
  
      scanCodes(){
  
        let code = null;
  
        this.barcodeScanner.scan().then(barcodeData => {
          this.scannedCode = barcodeData;
  
          code = JSON.stringify(this.scannedCode.text);
          console.log('Barcode data, LORENA GM, STRINGIFY', code);
          alert('El Escan arrojó el siguiente dato: '+code)
          
        }).catch(err => {
          console.log('Error', err);
        });
  
      }
  
      async startBG(){
        
        alert('Hola')
        const toast = await this.toastController.create({
          message: '¡Geolocalización Iniciada!',
          color: 'success',
          duration: 4000,
          buttons: [
            {
              side: 'end',
              icon: 'close',
              text: 'Cerrar',
              handler: () => {
                console.log('Cerrar clicked');
              }
            },
          ]
        });
    
        toast.present();        

        //this.backgroundGeolocation.start();
      }
  
      stopBG(){
        this.backgroundGeolocation.stop();
      }
    
    //START SCANER Y LIST

    async scanCode(id){

    let code = null;

    this.barcodeScanner.scan().then(async barcodeData => {
      this.scannedCode = barcodeData;

      code = JSON.stringify(this.scannedCode.text).replace(/['"]+/g, '');

      //code = '52794106';

      if(code!=null && code!=''){
        //alert('Data escaneada: '+code)

        let loading = await this.loadinController.create({
          spinner: loading_var,
          mode: modal_mode
        });
      
        loading.present();

        var data = {
          id_servicio: id,
          codigo: code
        }
        
        this.http.post(this.url_server+'/api/v1/scaneodeqr', data, this.httpOptions).subscribe(async data => {
          
          if(data['escaneado']===false){

            loading.dismiss();
            const alert = await this.alertController.create({
              cssClass: 'alert-danger',
              header: 'Aotour Mobile Driver',
              message: 'El pasajero ya fue escaneado.',
              mode: 'ios',
              buttons: [
                {
                  text: 'Cerrar',
                }
              ]
            });
            alert.present();

          }else if(data['respuesta']===true){
            
            const modal = await this.modalController.create({
              component: LecturaqrPage,
              cssClass: 'my-custom-class',
              mode: modal_mode,
              componentProps: {
                'usuarios': data['usuarios'],
              }
            });

            loading.dismiss();
            return modal.present();
    
          }else if(data['respuesta']===false){
            
            loading.dismiss();
            const alert = await this.alertController.create({
              cssClass: 'alert-danger',
              header: 'Aotour Mobile Driver',
              message: 'El pasajero escaneado no se encuentra programado en esta ruta.',
              mode: 'ios',
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
          header: 'Aotour Mobile Driver',
          message: 'No se leyó ningún código.',
          mode: 'ios',
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

  //RUTA ESCOLAR START
  async scanCodeE(id){

    let code = null;

    this.barcodeScanner.scan().then(async barcodeData => {
      this.scannedCode = barcodeData;

      code = JSON.stringify(this.scannedCode.text).replace(/['"]+/g, '');

      //code = '2361';

      if(code!=null && code!=''){
        //alert('Data escaneada: '+code)

        let loading = await this.loadinController.create({
          spinner: loading_var,
          mode: modal_mode
        });
      
        loading.present();

        var data = {
          id_servicio: id,
          codigo: code
        }
        
        this.http.post(this.url_server+'/api/v1/scaneodeqre', data, this.httpOptions).subscribe(async data => {
          
          if(data['escaneado']===false){

            loading.dismiss();
            const alert = await this.alertController.create({
              cssClass: 'alert-danger',
              header: 'Aotour Mobile Driver',
              message: 'El pasajero ya fue escaneado.',
              mode: 'ios',
              buttons: [
                {
                  text: 'Cerrar',
                }
              ]
            });
            alert.present();

          }else if(data['respuesta']===true){
            
            const actionSheet = await this.actionSheetController.create({
              header: 'Usuario Escaneado',
              mode: 'ios',
              cssClass: 'my-custom-class',
              buttons: [{
                text: data['usuario']['nombre_estudiante'],
                icon: 'person'
              },
              {
                text: data['usuario']['direccion'],
                icon: 'location'
              }, {
                text: 'Volver',
                icon: 'arrow-back',
                role: 'cancel'
              }]
            });
            await actionSheet.present();

            loading.dismiss();
    
          }else if(data['respuesta']===false){
            
            loading.dismiss();
            const alert = await this.alertController.create({
              cssClass: 'alert-danger',
              header: 'Aotour Mobile Driver',
              message: 'El pasajero escaneado no se encuentra programado en esta ruta.',
              mode: 'ios',
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
          header: 'Aotour Mobile Driver',
          message: 'No se leyó ningún código.',
          mode: 'ios',
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
  //RUTA ESCOLAR END
    
      async listaUsuarios(id){

      let loading = await this.loadinController.create({
        spinner: loading_var,
        mode: modal_mode
      });
    
      loading.present();
  
      var data = {
        id_servicio: id
      }
      
      this.http.post(this.url_server+'/api/v1/listapasajeros', data, this.httpOptions).subscribe(async data => {
        
        if(data['respuesta']===true){
  
          loading.dismiss();
  
          const modal = await this.modalController.create({
            component: UsuariosPage,
            cssClass: 'my-custom-class',
            mode: modal_mode,
            componentProps: {
              'data': data['usuarios'],
            }
          });
          return modal.present();
  
        }else if(data['respuesta']===false){
  
          loading.dismiss();
  
          const alert = await this.alertController.create({
            cssClass: 'alert-danger',
            header: 'Aotour Mobile Driver',
            message: 'Esta ruta no tiene pasajeros!',
            mode: 'ios',
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

    async listaUsuariosE(id, option){

      let loading = await this.loadinController.create({
        spinner: loading_var,
        mode: modal_mode
      });
    
      loading.present();
  
      var data = {
        id_servicio: id
      }
      
      this.http.post(this.url_server+'/api/v1/listapasajerose', data, this.httpOptions).subscribe(async data => {
        
        if(data['respuesta']===true){
  
          loading.dismiss();
          
          if(option==1){

            const modal = await this.modalController.create({
              component: UsuariosescolaresPage,
              cssClass: 'my-custom-class',
              mode: modal_mode,
              componentProps: {
                'data': data['usuarios'],
              }
            });

            return modal.present();

          }else{

            const modal = await this.modalController.create({
              component: AsistenciaPage,
              cssClass: 'my-custom-class',
              mode: modal_mode,
              componentProps: {
                'data': data['usuarios'],
              }
            });

            return modal.present();

          }          
  
        }else if(data['respuesta']===false){
  
          loading.dismiss();
  
          const alert = await this.alertController.create({
            cssClass: 'alert-danger',
            header: 'Aotour Mobile Driver',
            message: 'Esta ruta no tiene pasajeros!',
            mode: 'ios',
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

    async chat(id){

      let loading = await this.loadinController.create({
        spinner: loading_var,
        mode: modal_mode
      });
    
      loading.present();
  
      var data = {
        id: id
      }
      
      this.http.post(this.url_server+'/api/v1/chat', data, this.httpOptions).subscribe(async data => {
        
        if(data['respuesta']===true){
  
          loading.dismiss();

            var json = JSON.parse(data['mensajes']);
            console.log(json)
            const modal = await this.modalController.create({
              component: ChatPage,
              cssClass: 'my-custom-class',
              mode: modal_mode,
              componentProps: {
                'mensajes': json,
                'id': id
              }
            });

            return modal.present();     
  
        }else if(data['respuesta']===false){
  
          loading.dismiss();
  
          const alert = await this.alertController.create({
            cssClass: 'alert-danger',
            header: 'Aotour Mobile Driver',
            message: 'No hay mensajes disponibles!',
            mode: 'ios',
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

    async navegar(id) {
      
      var recoger = localStorage.getItem('recoger');
      var dejar = localStorage.getItem('dejar');

      //geocoder
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };

      this.nativeGeocoder.forwardGeocode(dejar, options)
        .then((result: NativeGeocoderResult[]) => 
          this.placeNavigate = result[0].latitude+','+result[0].longitude
        )
        .catch((error: any) => console.log(error));
      //geocoder
      
      let toLat="10.998986";
      let toLong="-74.800420";
      
      let destination = this.placeNavigate;// toLat + ',' + toLong;
  
  
      //1. Declaring an empty array
      let actionLinks=[];
  
      //2. Populating the empty array
  
       //2A. Add Google Maps App
      actionLinks.push({
        text: 'Google Maps',
        icon: 'navigate',
        handler: () => {
          window.open("https://www.google.com/maps/search/?api=1&query="+destination)
        }
      })
  
     
       //2B. Add Waze App
      actionLinks.push({
        text: 'Waze',
        icon: 'navigate',
        handler: () => {
          window.open("https://waze.com/ul?ll="+destination+"&navigate=yes&z=10");
        }
      });
  
     //2C. Add a cancel button, you know, just to close down the action sheet controller if the user can't make up his/her mind
      actionLinks.push({
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {

        }
      })
      
  
      
  
       const actionSheet = await this.actionSheetController.create({
       header: 'Navegar',
       backdropDismiss: false,
       buttons: actionLinks
       
      });
      await actionSheet.present();
    }

    /*calculateAndDisplayRoute(
      directionsService: google.maps.DirectionsService,
      directionsRenderer: google.maps.DirectionsRenderer
    ) {
      const waypts: google.maps.DirectionsWaypoint[] = [];

    
      directionsService
        .route({
          origin: (document.getElementById("start") as HTMLInputElement).value,
          destination: (document.getElementById("end") as HTMLInputElement).value,
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING,
        })
        .then((response) => {
          directionsRenderer.setDirections(response);
    
          const route = response.routes[0];
          
        })
        .catch((e) => window.alert("Directions request failed due to " + status));
    }*/

}
