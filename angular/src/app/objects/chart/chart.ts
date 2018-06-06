import {IChartistData} from 'chartist';

export class ChartObject<T> implements IChartistData
{
 public labels: Array<string>;
 public series: Array<Array<number>>;
 public max: number;
 public sourceObjects: T[];

 constructor()
 {
  this.labels = [];
  this.series = [];
  this.max = 0;
  this.sourceObjects = [];
 }
};