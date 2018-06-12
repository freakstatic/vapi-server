import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TimelapsesService {

  constructor(private http: HttpClient,) { }

  async getCodecs(){
      return this.http.get('api/timelapse/codecs').toPromise()
  }

  async getFormats(){
      return this.http.get('api/timelapse/formats').toPromise()
  }

  async getTimelapses(){
      return this.http.get('api/timelapses').toPromise()
  }

}
