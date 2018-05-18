import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Detection} from 'app/dto/detections/detection';

@Injectable()
export class DashboardService
{
 constructor(private router: Router, private http: HttpClient) { }

 public async getDetectionStatsLastWeek():Promise<Detection[]>
 {
  // let startDate = new Date();
  // startDate.setDate(startDate.getDate() - 6);
  // return this.getDetectionStats(startDate, new Date());
  let startDate = new Date("2018-05-09T00:00:00");
  let endDate = new Date("2018-05-15T00:00:00");
  startDate.setHours(0,0,0,0);
  endDate.setHours(0,0,0,0);
  return this.getDetectionStats(startDate, endDate);
 }

 public getDetectionStats(startDate: Date, endDate: Date):Promise<Detection[]>
 {
  return new Promise<Detection[]>((resolve, reject) =>
  {
   this.http.get('api/stats/detection?startDate=' + startDate.toISOString() + '&endDate=' + endDate.toISOString())
    .subscribe((response: any) =>
    {
     let detections:Detection[]=[];

     for(let dateString in response)
     {
      if(!response.hasOwnProperty(dateString))
      {
       continue;
      }
      let detection=new Detection();
      detection.numberOfDetections=response[dateString];
      detection.detectionObjects=null;
      detection.id=null;
      detection.date=new Date(dateString);
      detections.push(detection);
     }
     resolve(detections);
    }, (errorResponse: HttpErrorResponse) =>
    {
     reject(errorResponse);
    });
  })
 }
}
