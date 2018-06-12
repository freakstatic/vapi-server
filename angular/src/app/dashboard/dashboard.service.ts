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
import {DetectionTime} from '../objects/chart/detection.time';

@Injectable()
export class DashboardService
{
 private _detectionChartLast7Weeks: BehaviorSubject<ChartObject<Detection>>;
 private _detectableStatChartTime: BehaviorSubject<DetectableStat[]>;
 constructor(private router: Router, private http: HttpClient, private socket: Socket, private translate: TranslateService)
 {
  this._detectionChartLast7Weeks = new BehaviorSubject<ChartObject<Detection>>(new ChartObject<Detection>());
  this._detectionChartTime = new BehaviorSubject<ChartObject<DetectionTime>>(new ChartObject<DetectionTime>());
  this._detectableStatChartTime = new BehaviorSubject<DetectableStat[]>([]);
  this._usedSpace = new BehaviorSubject<number>(0);
  
  this.socket.on('storageReport', (data: any) =>
  {
   this._usedSpace.next(parseInt(data,10));
  });
  
  this.socket.on('detection', data =>
  {
   if (data == null || data === undefined)
   {
    return;
   }
   const detection = Detection.Instance(data);
   if (detection == null || detection === undefined)
   {
    return;
   }
   this.socket.emit('storageReport');
   this.onDetectionByWeek(detection);
   this.onDetectionByTime(detection);
   this.onDetectableStat(data);
  });
 }
 private _detectionChartTime: BehaviorSubject<ChartObject<DetectionTime>>;
 
 private _usedSpace: BehaviorSubject<number>;
 
 get detectionChartTime(): Observable<ChartObject<DetectionTime>>
 {
  return this._detectionChartTime.asObservable();
 }
 
 //Top5Detectable|||||||||||
 get detectableStat(): Observable<DetectableStat[]>
 {
  return this._detectableStatChartTime.asObservable();
 }
 
 public async initDetectionChartLast7Weeks()
 {
  const detections = await this.getDetectionStatsLastWeek();
  const serie = [];
  const object = new ChartObject<Detection>();
  object.series.push(serie);
  for (const detection of detections)
  {
   const weekdayName = detection.date.getDayName();
   this.translate.get(weekdayName.toUpperCase()).subscribe((res: string) =>
   {
    object.labels.push(res.substr(0, 1).toUpperCase());
   });
   serie.push(detection.numberOfDetections);
   if (detection.numberOfDetections > object.max)
   {
    object.max = detection.numberOfDetections;
   }
   object.sourceObjects.push(detection);
  }
  this._detectionChartLast7Weeks.next(object);
 }
 
 //Detection Stuff|||||||||
 get detectionChartLast7Weeks(): Observable<ChartObject<Detection>>
 {
  return this._detectionChartLast7Weeks.asObservable();
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
  });
 }
 
 public initDetectionChartTime()
 {
  const chartObject = new ChartObject<DetectionTime>();
  chartObject.series.push([]);
  for (let i = 0; i < 24; i++)
  {
   const detectionTime = new DetectionTime();
   const iString = i.toString().trim();
   detectionTime.time = iString.length === 1 ? '0' + iString : iString;
   chartObject.sourceObjects.push(detectionTime);
   chartObject.labels.push(detectionTime.time);
   chartObject.series[0].push(0);
  }
  this.http.get('api/stats/detection/time')
   .subscribe((data: Array<any>) =>
   {
    if (data === undefined || data === null)
    {
     return;
    }
    for (const obj of data)
    {
     const detection = DetectionTime.IntanceFromWebService(obj);
     if (detection === undefined || detection === null)
     {
      continue;
     }
     const index = parseInt(obj.time, 10);
     if (index === -1)
     {
      continue;
     }
     chartObject.sourceObjects[index].numberOccurrences += detection.numberOccurrences;
     chartObject.series[0][index] = detection.numberOccurrences;
     if (chartObject.max < detection.numberOccurrences)
     {
      chartObject.max = detection.numberOccurrences;
     }
    }
    this._detectionChartTime.next(chartObject);
   });
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
 
 public initTop5()
 {
  this.http.get('api/stats/detectable/top5')
   .subscribe((data: Array<any>) =>
   {
    if (data === undefined || data === null)
    {
     return;
    }
    
    const detectables: DetectableStat[] = [];
    for (const obj of data)
    {
     const detectable = DetectableStat.IntanceFromWebService(obj);
     if (detectable !== undefined && detectable !== null)
     {
      detectables.push(detectable);
     }
    }
    this._detectableStatChartTime.next(detectables);
   });
 }
 
 //Storage|||||||||||||||||
 get usedSpace(): Observable<number>
 {
  return this._usedSpace.asObservable();
 }
 
 public initUsedSpace(): Promise<number>
 {
  return new Promise<number>((resolve, reject) =>
  {
   this.http.get('api/storage')
    .subscribe((data: any) =>
    {
     if(data.hasOwnProperty('usedSpace'))
     {
      this._usedSpace.next(parseInt(data.usedSpace,10));
     }
     if(data.hasOwnProperty('diskSpace'))
     {
      resolve(parseInt(data.diskSpace,10));
     }
     else
     {
      reject();
     }
    },error=>
    {
     reject(error);
    });
  });
 }
 
 private onDetectionByWeek(detection: Detection)
 {
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
 }
 
 private onDetectionByTime(detection: Detection)
 {
  const object = this._detectionChartTime.getValue();
  const index = detection.date.getHours();
  object.sourceObjects[index].numberOccurrences += detection.numberOfDetections;
  object.series[0][index] = object.sourceObjects[index].numberOccurrences;
  if (object.series[0][index] > object.max)
  {
   object.max = object.series[0][index];
  }
  this._detectionChartTime.next(object);
 }
 
 private onDetectableStat(detection: Detection)
 {
  const object = this._detectableStatChartTime.getValue();
  for (const obj of detection.detectionObjects)
  {
   const detectable = DetectableStat.IntanceFromDetectableObject(obj.object);
   if (detectable == null)
   {
    return;
   }
   
   const index = object.findIndex(element =>
   {
    return element.name === detectable.name;
   });
   if (index < 0)
   {
    object.push(detectable);
   }
   else
   {
    object[index].numberOccurrences += detectable.numberOccurrences;
   }
   
   object.sort((a, b) =>
   {
    if (a.numberOccurrences < b.numberOccurrences)
    {
     return 1;
    }
    if (a.numberOccurrences > b.numberOccurrences)
    {
     return -1;
    }
    return 0;
   });
  }
  this._detectableStatChartTime.next(object);
 }
}
