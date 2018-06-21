export class DetectionEvent
{
 public id: number;
 public startDate: Date;
 public endDate: Date;
 
 public static Instance(data: any): DetectionEvent
 {
  if(data===undefined||data===null)
  {
   return null;
  }
  if (!(data.hasOwnProperty('id') && data.hasOwnProperty('startDate') && data.hasOwnProperty('endDate')))
  {
   return null;
  }
  const detectionEvent=new DetectionEvent();
  detectionEvent.id=data.id;
  detectionEvent.startDate=new Date(data.startDate);
  detectionEvent.endDate=new Date(data.endDate);
  return detectionEvent;
 }
}