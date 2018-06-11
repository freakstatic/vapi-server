import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ChartObject} from 'app/objects/chart/chart';
import {Detection} from 'app/objects/detections/detection';
import {Socket} from 'ngx-socket-io';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {DetectableStat} from '../objects/chart/detectable.stat';
import './../../utils/date.extensions';

@Injectable()
export class DashboardService
{
 private _detectionChartLast7Weeks = new BehaviorSubject<ChartObject<Detection>>(new ChartObject<Detection>());

 constructor(private router: Router, private http: HttpClient, private socket: Socket, private translate: TranslateService)
 {
  this.socket.on('detection', data =>
  {
   if (data == null)
   {
    return;
   }
   const detection = Detection.NewInstanceFromDetectionSocket(data);
   const object = this._detectionChartLast7Weeks.getValue();
   let index = object.sourceObjects.findIndex(element =>
   {
    return element.date.toDateISOString() === detection.date.toDateISOString();
   });
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
    index = object.sourceObjects.length - 1;
   }
   object.sourceObjects[index].numberOfDetections += detection.numberOfDetections;
   object.series[0][index] += detection.numberOfDetections;
   if (object.series[0][index] > object.max)
   {
    object.max = object.series[0][index];
   }
   this._detectionChartLast7Weeks.next(object);
  });
 }

 //Detection Stuff|||||||||
 get detectionChartLast7Weeks(): Observable<ChartObject<Detection>>
 {
  return this._detectionChartLast7Weeks.asObservable();
 }

 public async initDetectionChartLast7Weeks()
 {
  const detections = await this.getDetectionStatsLastWeek();
  const serie = [];
  const object = this._detectionChartLast7Weeks.getValue();
  object.series.push(serie);
  for (const detection of detections)
  {
   const weekdayName = detection.date.getDayName();
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
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date();
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
     const detections: Detection[] = [];

     for (const dateString in response)
     {
      if (!response.hasOwnProperty(dateString))
      {
       continue;
      }
      const detection = new Detection();
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

 //Top5Detectable|||||||||||
 public initTop5(): Promise<DetectableStat[]>
 {
  return new Promise<DetectableStat[]>((resolve, reject) =>
  {
   this.http.get('api/stats/detectable/top5')
    .subscribe((data: Array<any>) =>
    {
     if (data == undefined || data == null)
     {
      reject();
     }
     const detectables: DetectableStat[] = [];
     for (const obj of data)
     {
      const detectable = DetectableStat.IntanceFromWebService(obj);
      if (detectable != undefined && detectable != null)
      {
       detectables.push(detectable);
      }
     }
     resolve(detectables);
    }, (error) =>
    {
     reject(error);
    });
  });
 }
}
