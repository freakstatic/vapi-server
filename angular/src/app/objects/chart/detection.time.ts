export class DetectionTime
{
 public time:string;
 public numberOccurrences:number;
 
 public constructor()
 {
  this.time='';
  this.numberOccurrences=0;
 }
 
 public static IntanceFromWebService(data:any):DetectionTime
 {
  if(!(data.hasOwnProperty('time')&&data.hasOwnProperty('numberOccurrences')))
  {
   return null;
  }
  const detection=new DetectionTime();
  detection.time=data.time;
  detection.numberOccurrences=parseInt(data.numberOccurrences,10);
  return detection;
 }
}