import {Detection} from './detection';

export class DetectionImage
{
 id: number;
 detection: Detection;
 path: string;
 dateCreated: Date;
 
 static Instance(data: any, detection?: Detection): DetectionImage
 {
  if (!(data.hasOwnProperty('id') &&
   data.hasOwnProperty('path') &&
   data.hasOwnProperty('dateCreated')))
  {
   return null;
  }
  const detectionImage=new DetectionImage();
  detectionImage.id=data.id;
  detectionImage.detection=detection;
  detectionImage.dateCreated=new Date(data.dateCreated);
  detectionImage.path=data.path;
  return detectionImage;
 }
}