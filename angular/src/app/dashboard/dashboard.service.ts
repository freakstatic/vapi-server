import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ChartObject} from 'app/objects/chart/chart';
import {Detection} from 'app/objects/detections/detection';
import {Socket} from 'ngx-socket-io';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import './../../utils/date.extensions';

@Injectable()
export class DashboardService
{
 constructor(private router: Router, private http: HttpClient, private socket: Socket, private translate: TranslateService)
 {
  this.socket.on('detection', data =>
  {
   if (data == null)
   {
    return;
   }
   let detection: Detection = data;
   let object = this._detectionChartLast7Weeks.getValue();

   let index = object.sourceObjects.findIndex(element =>
   {
    return element.date.toISOString() === detection.date.toISOString();
   });
   console.log(index);
   if (index < 0)
   {
    if (object.sourceObjects[object.sourceObjects.length - 1].date >= detection.date)
    {
     return;
    }
    object.sourceObjects.push(detection);
    object.labels.push('1');
    object.series[0].push(0);
    object.sourceObjects.shift();
    object.labels.shift();
    object.series[0].shift();
    index=object.sourceObjects.length-1;
   }
   object.series[0][index] += detection.numberOfDetections;
   if (object.series[0][index] > object.max)
   {
    object.max = object.series[0][index];
   }
   this._detectionChartLast7Weeks.next(object);
  });
 }

 private _detectionChartLast7Weeks = new BehaviorSubject<ChartObject<Detection>>(new ChartObject());

 get detectionChartLast7Weeks(): BehaviorSubject<any>
 {
  return this._detectionChartLast7Weeks;
 }

 public async initDetectionChartLast7Weeks()
 {
  let detections = await this.getDetectionStatsLastWeek();
  let serie = [];
  let object = this._detectionChartLast7Weeks.getValue();
  object.series.push(serie);
  for (let detection of detections)
  {
   let weekdayName = detection.date.getDayName();
   this.translate.get(weekdayName.toUpperCase()).subscribe((res: string) =>
   {
    object.labels.push(res.substr(0, 1).toUpperCase());
   });
   // object.labels.push(detection.date.toDateISOString());
   serie.push(detection.numberOfDetections);
   if (detection.numberOfDetections > object.max)
   {
    object.max = detection.numberOfDetections;
   }
   object.sourceObjects.push(detection);
  }
  this._detectionChartLast7Weeks.next(object);
 }

 public async getDetectionStatsLastWeek(): Promise<Detection[]>
 {
  let startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);
  let endDate = new Date();
  endDate.setHours(24, 0, 0, 0);
  return this.getDetectionStats(startDate, endDate);
 }

 public getDetectionStats(startDate: Date, endDate: Date): Promise<Detection[]>
 {
  return new Promise<Detection[]>((resolve, reject) =>
  {
   this.http.get('api/stats/detection?startDate=' + startDate.toISOString() + '&endDate=' + endDate.toISOString())
    .subscribe((response: any) =>
    {
     let detections: Detection[] = [];

     for (let dateString in response)
     {
      if (!response.hasOwnProperty(dateString))
      {
       continue;
      }
      let detection = new Detection();
      detection.numberOfDetections = response[dateString];
      detection.detectionObjects = null;
      detection.id = null;
      detection.date = new Date(dateString);
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
