import { Injectable } from '@angular/core';
import { CanLoad, Route, Router,} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { filter, map, take } from 'rxjs/operators';

import { Platform } from '@ionic/angular';
import { FcmService } from '../services/fcm.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  
  constructor(private authService: AuthenticationService, private router: Router, private platform: Platform,
    private fcmService: FcmService){}
  
  canLoad(): Observable<boolean> {
    
    //this.initializeApp();

    return this.authService.isAuthenticated.pipe(
      filter(val => val !=null),
      take(1),
      map(isAuthenticated => {
        console.log('GUARD: ', isAuthenticated);

        if(isAuthenticated){
          return true;
        }else{
          this.router.navigateByUrl('/login');
          return false;
        }
      })
    )
  }

  /*initializeApp() {
    this.platform.ready().then(() => {
      console.log('Init Push iniciado');
      // Trigger the push setup
      this.fcmService.initPush();
    });
  }*/
}
