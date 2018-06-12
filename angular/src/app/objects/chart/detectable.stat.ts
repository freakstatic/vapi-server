import {DetectableObject} from '../detections/detectable.object';

export class DetectableStat extends DetectableObject
{
 public numberOccurrences:number;

 public static IntanceFromWebService(data:any):DetectableStat
 {
  if(!(data.hasOwnProperty('detectable_name')&&data.hasOwnProperty('detectable_id')&&data.hasOwnProperty('numberoccurrences')))
  {
   return null;
  }
  const detectable=new DetectableStat();
  detectable.name=data.detectable_name;
  detectable.numberOccurrences=parseInt(data.numberoccurrences);
  detectable.id=data.detectable_id;
  return detectable;
 }
 public static IntanceFromDetectableObject(data:DetectableObject)
 {
  if(data===undefined||data===null)
  {
   return null;
  }
  const detectable=new DetectableStat();
  detectable.name=data.name;
  detectable.numberOccurrences=1;
  detectable.id=data.id;
  return detectable;
 }
}