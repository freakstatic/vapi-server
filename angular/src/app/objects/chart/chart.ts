export class ChartObject<T>
{
 public labels: String[];
 public series: Array<number>[];
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