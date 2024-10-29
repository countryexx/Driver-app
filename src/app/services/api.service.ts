import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { url } from './../server';

export interface ApiImage {
  _id: string;
  name: string;
  createdAt: Date;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = 'http://localhost:3000';

  id_usuario:any;
  url_server:any;
  httpOptions:any;

  constructor(private http: HttpClient) {

    this.id_usuario = localStorage.getItem('id_usuario');
      
      this.url_server = url;
      this.httpOptions = {
        headers: new HttpHeaders({ "Authorization": localStorage.getItem('token') },)
      };

  }

  uploadImage(blobData, name, ext) {
    const formData = new FormData();
    formData.append('file', blobData, `myimage.${ext}`);
    formData.append('name', name);

    var data = {
      tipo_ruta: 'INGRESO',
      hora: '19:00',
      fecha: '2021-11-15',
      cliente: 'SUTHERLAND BAQ',
      image: blobData,
      nombre_imagen: 'TEXTO DE IMAGEN',
      nombre_documento: 'VERIFICACIÓN DE RUTA',
      placa: '',
      id_usuario: this.id_usuario,
      novedades: ''
    }
    
    this.http.post(this.url_server+'/api/v1/gestiondocumental', data, this.httpOptions).subscribe(async data => {
      
      if(data['respuesta']===true){
        
      }else if(data['respuesta']===false){
        
      }
    }, err => {
      console.log(err);
    });
    
    return this.http.post(`${this.url}/image`, formData);
  }

  uploadImageFile(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('name', file.name);
    return this.http.post(`${this.url}/image`, formData);
  }

  getImages() {
    return this.http.get<ApiImage[]>(`${this.url}/image`);
  }

  deleteImage(id) {
    return this.http.delete(`${this.url}/image/${id}`);
  }

}
