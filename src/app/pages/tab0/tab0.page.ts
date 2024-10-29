import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController } from '@ionic/angular';
import { Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

declare var google;

@Component({
  selector: 'app-tab0',
  templateUrl: './tab0.page.html',
  styleUrls: ['./tab0.page.scss'],
})
export class Tab0Page implements OnInit {

  scannedCode = null;
  total:number;

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;
  currentMapTrack = null;
  marker = null;
  marker2 = null;
  image = null;
  image2 = null;

  latitude: number;
  longitude: number;

  selectedPath = '';
  locations: any;
  locations2: any;
  arr:any;
  array:any;

  constructor(private router: Router, private authService: AuthenticationService, private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder, public modalController: ModalController) { }

  ngOnInit() {
    this.loadMap();
    
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {

      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {

      this.locations = data;
      let MyLG = new google.maps.LatLng(this.locations.coords.latitude, this.locations.coords.longitude);
      this.marker.setPosition(MyLG);
      
    });
  }

  addMarker(map:any){

    this.image={
      url: 'assets/marker3.png',
      scaledSize: new google.maps.Size(55, 55),
    };

    this.marker = new google.maps.Marker({
      map: map,
      icon: this.image,
      animation: google.maps.Animation.DROP,
      position: map.getCenter()
    });
  }

  addMarker2(map:any){
    
    this.image2={
      url: 'assets/marker_bandera.png',
      scaledSize: new google.maps.Size(55, 55),
    }

    this.marker2 = new google.maps.Marker({
      map: map,
      icon: this.image2,
      animation: google.maps.Animation.DROP,
      position: map.getCenter()
    });
  }

  showHistoryRoute(){

    this.locations = localStorage.getItem('locations');

    var resultArray = JSON.parse(localStorage.getItem('locations'));
    var triangleCoordsLS12 = [];
    
    var start = new google.maps.LatLng( resultArray[0].lat, resultArray[0].lng);
    var end = new google.maps.LatLng( resultArray[resultArray.length-1].lat, resultArray[resultArray.length-1].lng);

    for (var i=0; i<resultArray.length; i++) {
      triangleCoordsLS12[i] = new google.maps.LatLng( resultArray[i].lat, resultArray[i].lng);
    }

    this.redrawPath(triangleCoordsLS12, start, end);
  }

  redrawPath(path, start, end){

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

      this.addMarker(this.map);
      this.addMarker2(this.map);

      var bounds = new google.maps.LatLngBounds();

      let MyLG = new google.maps.LatLng(10.9896674, -74.7907815);
      this.marker.setPosition(start);      

      let MyLG2 = new google.maps.LatLng(11.0131457, -74.8298599);
      this.marker2.setPosition(end);

      bounds.extend(start);
      bounds.extend(end);

      this.map.fitBounds(bounds);

      this.currentMapTrack.setMap(this.map);
    }
  }

}
