import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';


export const INTRO_KEY = 'intro-seen';
import { Storage } from '@capacitor/storage';

//import { AnyPlugin } from '@capacitor/core';
//const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {
  constructor(private router: Router) {}

  async canLoad(): Promise<boolean>{

    console.log('test 22')
    const hasSeenIntro = await Storage.get({key: INTRO_KEY });
    if(hasSeenIntro && (hasSeenIntro.value== 'true')){
      return true;
    }else{
      this.router.navigateByUrl('/intro', { replaceUrl: true});
      return true;
    }

  }
}
