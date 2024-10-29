import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-lecturaqr',
  templateUrl: './lecturaqr.page.html',
  styleUrls: ['./lecturaqr.page.scss'],
})
export class LecturaqrPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
