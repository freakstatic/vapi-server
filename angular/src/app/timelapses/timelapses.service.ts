import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment';

@Injectable()
export class TimelapsesService {

  constructor(private http: HttpClient) { }

  async getCodecs(){
      return this.http.get(environment.apiEndpoint + 'timelapse/codecs').toPromise()
  }

  async getFormats(){
      return this.http.get( environment.apiEndpoint +'timelapse/formats').toPromise()
  }

  async getTimelapses(){
      return this.http.get(environment.apiEndpoint + 'timelapses').toPromise()
  }

  async getTimelapseScheduleOptions(){
      return this.http.get(environment.apiEndpoint + 'timelapse/schedule-options').toPromise()
  }

  async scheduleTimelaseJobs(timelapseJobs){
      return this.http.post( environment.apiEndpoint + 'timelapse/jobs/add', {timelapseJobs: timelapseJobs}).toPromise()
  }

  async getJobs(){
      return this.http.get(environment.apiEndpoint + 'timelapse/jobs').toPromise()
  }

}
