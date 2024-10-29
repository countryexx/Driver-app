import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FcmService } from './services/fcm.service';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  start:any;
  constructor(private platform: Platform,
    private fcmService: FcmService,
    private backgroundGeolocation: BackgroundGeolocation) {
      this.initializeApp();
      this.start = 0;
    }

    initializeApp() {

      //this.backgroundGeolocation.checkStatus
      
      this.platform.ready().then(() => {
        console.log('Init Stared')
        setTimeout(() => {
          this.start = 1;
        }, 4000);
        
        // Trigger the push setup 
        //this.fcmService.initPush();
      });
    }
}
