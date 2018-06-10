import {DetectableObject} from '../detections/detectable.object';

export class DetectableStat extends DetectableObject
{
 public numberOccurrences:number;

 public static IntanceFromWebService(data:any):DetectableStat
 {
  let detectable=new DetectableStat();
  detectable.name=data.name;
  detectable.numberOccurrences=data.numberOccurrences;
  detectable.id=data.id;
  return detectable;
 }
}