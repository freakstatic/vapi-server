import {DetectionEvent} from './detection.event';
import {DetectionObject} from './detection.object';

export class Detection
{
 id: number;
 date: Date;
 detectionObjects: DetectionObject[];
 numberOfDetections: number;
 image: DetectionImage;
 event: DetectionEvent;
 
 public static Instance(data: any): Detection
 {
  if (!data.hasOwnProperty('date'))
  {
   return null;
  }
  const detection = new Detection();
  detection.date = new Date(data.date);
  if (data.hasOwnProperty('id'))
  {
   detection.id = data.id;
  }
  if (data.hasOwnProperty('numberOfDetections'))
  {
   detection.numberOfDetections = data.numberOfDetections;
  }
  if (data.hasOwnProperty('detectionObjects'))
  {
   detection.detectionObjects = [];
   if (Array.isArray(data.detectionObjects))
   {
    for (const detectionObject of data.detectionObjects)
    {
     const obj = DetectionObject.Instance(detectionObject);
     if (obj !== null)
     {
      detection.detectionObjects.push(obj);
     }
    }
   }
   else
   {
    const detectionObject = DetectionObject.Instance(data.detectionObjects);
    if (detectionObject !== null)
    {
     detection.detectionObjects.push(detectionObject);
    }
   }
  }
 
  if (data.hasOwnProperty('image'))
  {
   const detectionImage = DetectionImage.Instance(data.image);
   if (detectionImage !== null)
   {
    detection.detectionObjects.push(detectionImage);
   }
  }
 
  if (data.hasOwnProperty('event'))
  {
   const detectionEvent = DetectionEvent.Instance(data.image);
   if (detectionEvent !== null)
   {
    detection.detectionObjects.push(detectionEvent);
   }
  }
  return detection;
 }
}