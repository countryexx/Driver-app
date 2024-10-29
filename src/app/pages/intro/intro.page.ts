import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController } from '@ionic/angular';
import { INTRO_KEY } from 'src/app/guards/intro.guard';
import { Storage } from '@capacitor/storage';
import { Router } from '@angular/router';
import { loading_var, modal_mode } from 'src/app/vars';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  
  @ViewChild(IonSlides) slides: IonSlides;

  constructor(private router: Router, private loadinController: LoadingController) { }

  ngOnInit() {
  }

  next() {
    this.slides.slideNext();
  }

  async start() {

    let loading = await this.loadinController.create({
      spinner: loading_var,
      cssClass: 'load',
      mode: modal_mode
    });
  
    loading.present();
    await Storage.set({key: INTRO_KEY, value: 'true'});

    setTimeout(() => {
      loading.dismiss();      
      this.router.navigateByUrl('/login', {replaceUrl:true});
    }, 700);

  }

}
