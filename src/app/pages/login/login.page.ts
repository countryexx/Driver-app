import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { url } from './../../server';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  credent:any;
  usernames:any;
  passwords:any;
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadinController: LoadingController,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      username: ['@aotour.com.co', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
    })
  }

  async pruebas(){

    this.usernames = 'sgonzalez@aotour.com.co';
    this.passwords = '12345678';
    var server = 'http://localhost/autonet';
    var xhr = new XMLHttpRequest();
    xhr.open("POST", server + "/oauth/accesstoken", true);
    xhr.withCredentials = false;
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    var requestParams = "grant_type=password&username=" + encodeURIComponent(this.usernames) + "&password=" + encodeURIComponent(this.passwords);
    xhr.send(requestParams);

    xhr.onload = () => {

      if (xhr.status == 200) {
        let response = JSON.parse(xhr.responseText);
      }

    }
  }

  async login() {
    this.authService.login(this.credentials.value);
  }

  get username() {
    return this.credentials.get('username');
  }

  get password() {
    return this.credentials.get('password');
  }

}
