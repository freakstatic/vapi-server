import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TimelapsesService {

  constructor(private http: HttpClient,) { }

  async getCodecs(){
      return new Promise((resolve, reject) => {
          this.http.get('api/timelapse/codecs').toPromise().then((response) => {
              resolve(response);
          })
      })
  }

  async getFormats(){
      return new Promise((resolve, reject) => {
          this.http.get('api/timelapse/formats').toPromise().then((response) => {
              resolve(response);
          })
      });
  }

}
