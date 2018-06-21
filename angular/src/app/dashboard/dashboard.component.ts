import {Component, OnDestroy, OnInit} from '@angular/core';
import * as Chartist from 'chartist';
import {DetectableStat} from '../objects/chart/detectable.stat';
import {Observable} from 'rxjs/Observable';
import {ChartObject} from '../objects/chart/chart';
import {Detection} from '../objects/detections/detection';
import {DashboardService} from './dashboard.service';
import {DetectionTime} from '../objects/chart/detection.time';
import {DetectableObject} from '../objects/detections/detectable.object';
import {DetectionObject} from '../objects/detections/detection.object';
import {environment} from '../../environments/environment';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
    param = {value: 'world'};
    public lastUpdatedDetectionStats: number;
    public lastUpdatedDetectionStatsTime: number;
    public detectionPercentage: number;
    public detectionUpDownClass: string;
    public detectableObjects: DetectableStat[];
    public diskSpace: number;
    public usedSpace: number;
    public lastDetection:Detection;
    
    private lastDetectionObeservable:Observable<Detection>;
    private readonly interval;
    private detectionChartLast7Weeks: Observable<ChartObject<Detection>>;
    private detectionChartTime: Observable<ChartObject<DetectionTime>>;
    private detectableStat: Observable<DetectableStat[]>;
    private usedSpaceObservable: Observable<number>;
    private lastDetectionDetectables:DetectableObject[];
    private staticNumericIterator:Iterator<number>;

    constructor(private dashboardService: DashboardService) {
        this.lastUpdatedDetectionStats = 0;
        this.lastUpdatedDetectionStatsTime = 0;
        this.detectionUpDownClass = '';
        this.detectableObjects = [];
        this.detectionPercentage = 0;
        this.diskSpace = 0;
        this.usedSpace = 0;
        this.lastDetection=null;

        this.lastDetectionObeservable=this.dashboardService.lastDetection;
        this.detectionChartLast7Weeks = this.dashboardService.detectionChartLast7Weeks;
        this.detectionChartTime = this.dashboardService.detectionChartTime;
        this.detectableStat = this.dashboardService.detectableStat;
        this.usedSpaceObservable = this.dashboardService.usedSpace;
        this.lastDetectionDetectables=null;
        this.staticNumericIterator=null;

        this.interval = setInterval(() => {
            this.lastUpdatedDetectionStats++;
            this.lastUpdatedDetectionStatsTime++;
        }, 1000);
    }

    startAnimationForLineChart(chart) {
        let seq: any, delays: any, durations: any;
        seq = 0;
        delays = 80;
        durations = 500;

        chart.on('draw', function (data) {
            if (data.type === 'line' || data.type === 'area') {
                data.element.animate({
                    d: {
                        begin: 600,
                        dur: 700,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.Svg.Easing.easeOutQuint
                    }
                });
            }
            else if (data.type === 'point') {
                seq++;
                data.element.animate({
                    opacity: {
                        begin: seq * delays,
                        dur: durations,
                        from: 0,
                        to: 1,
                        easing: 'ease'
                    }
                });
            }
        });

        seq = 0;
    };

    startAnimationForBarChart(chart) {
        let seq2: any, delays2: any, durations2: any;

        seq2 = 0;
        delays2 = 80;
        durations2 = 500;
        chart.on('draw', function (data) {
            if (data.type === 'bar') {
                seq2++;
                data.element.animate({
                    opacity: {
                        begin: seq2 * delays2,
                        dur: durations2,
                        from: 0,
                        to: 1,
                        easing: 'ease'
                    }
                });
            }
        });

        seq2 = 0;
    };

    public get numberRowsLastDetectable():Iterator<number>
    {
     if(this.lastDetection===undefined||this.lastDetection===null)
     {
      return new Array<number>(0).keys();
     }
     return this.staticNumericIterator;
    }

    ngOnDestroy() {
        clearInterval(this.interval);
    }
    
    ngOnInit() {
        this.detectionChartLast7Weeks.subscribe(object => {
            const seriesArray = object.series[0];
            if (seriesArray == null || seriesArray === undefined) {
                return;
            }
            const yesterdayDetection = object.sourceObjects[object.sourceObjects.length - 2];
            const todayDetection = object.sourceObjects[object.sourceObjects.length - 1];

            if (yesterdayDetection.numberOfDetections >= todayDetection.numberOfDetections) {
                this.detectionPercentage = todayDetection.numberOfDetections - yesterdayDetection.numberOfDetections;
                if (todayDetection.numberOfDetections !== 0) {
                    this.detectionPercentage /= todayDetection.numberOfDetections;
                }
            }
            else {
                let divider = yesterdayDetection.numberOfDetections;
                if (divider === 0) {
                    divider = 1;
                }
                this.detectionPercentage = todayDetection.numberOfDetections / divider;
            }
            this.detectionPercentage *= 100;

            if (this.detectionPercentage > 0) {
                this.detectionUpDownClass = 'fa fa-long-arrow-up';
            }
            else if (this.detectionPercentage < 0) {
                this.detectionUpDownClass = 'fa fa-long-arrow-down';
            }
            else {
                this.detectionUpDownClass = '';
            }

            const optionsDailySalesChart: any = {
                lineSmooth: Chartist.Interpolation.cardinal({
                    tension: 0
                }),
                low: 0,
                high: object.max + 2, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                chartPadding: {top: 0, right: 0, bottom: 0, left: 0}
            };
            const dailySalesChart = new Chartist.Line('#dailySalesChart', object, optionsDailySalesChart);

            this.startAnimationForLineChart(dailySalesChart);
            this.lastUpdatedDetectionStats = 0;
        });
        this.detectionChartTime.subscribe((object: ChartObject<DetectionTime>) => {
            const optionswebsiteViewsChart = {
                axisX: {
                    showGrid: false
                },
                low: 0,
                high: object.max + 2,
                chartPadding: {top: 0, right: 5, bottom: 0, left: 0}
            };
            const responsiveOptions: any[] = [
                ['screen and (max-width: 640px)', {
                    seriesBarDistance: 5,
                    axisX: {
                        labelInterpolationFnc: function (value) {
                            return value[0];
                        }
                    }
                }]];
            const statsByTime = new Chartist.Bar('#statsTime', object, optionswebsiteViewsChart, responsiveOptions);
            this.startAnimationForBarChart(statsByTime);
            this.lastUpdatedDetectionStatsTime = 0;
        });
        this.detectableStat.subscribe((data: DetectableStat[]) => {
            if (data === undefined || data === null) {
                return;
            }
            this.detectableObjects = data;
        });
        this.usedSpaceObservable.subscribe((data: number) => {
            this.usedSpace = data;
        });
        
        this.lastDetectionObeservable.subscribe((detection:Detection)=>
        {
         if(detection===undefined||detection===null)
         {
             return;
         }
         this.lastDetection=detection;
         this.lastDetectionDetectables=this.lastDetection.detectionObjects.map((value:DetectionObject)=> value.object);
         this.staticNumericIterator=new Array(Math.floor(this.lastDetectionDetectables.length/3)+1).keys();
        });

        this.dashboardService.initLastDetection();
        this.dashboardService.initDetectionChartLast7Weeks();
        this.dashboardService.initDetectionChartTime();
        this.dashboardService.initTop5();
        this.dashboardService.initUsedSpace().then(diskSpace => {
            this.diskSpace = diskSpace;
        });
    }
    
    public getBeautifiedDetectables(row:number):DetectableObject[]
    {
        if(this.lastDetection===undefined||this.lastDetection===null)
        {
            return [];
        }
        const rowStartIndex=row*3;
        let rowEndIndex=rowStartIndex+3;
        if(rowEndIndex>this.lastDetectionDetectables.length)
        {
         rowEndIndex=this.lastDetectionDetectables.length;
        }
        return this.lastDetectionDetectables.slice(rowStartIndex,rowEndIndex);
    }
 
 public getDetectionImage(): string
 {
  if (this.lastDetection === undefined || this.lastDetection === null)
  {
   return '';
  }
  const lastIndex = this.lastDetection.image.path.lastIndexOf('/');
  const filename = this.lastDetection.image.path.substr(lastIndex);
  return environment.apiURL + '/detection/img' + filename;
 }
}
