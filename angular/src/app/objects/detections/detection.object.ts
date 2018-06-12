import {DetectableObject} from 'app/objects/detections/detectable.object';
import {Detection} from 'app/objects/detections/detection';

export class DetectionObject
{
 id: number;
 probability: number;
 x: number;
 y: number;
 width: number;
 height: number;
 detection: Detection;
 object: DetectableObject;
 
 static Instance(data: any, detection?: Detection): DetectionObject
 {
  if (!(data.hasOwnProperty('id') &&
   data.hasOwnProperty('probability') &&
   data.hasOwnProperty('x') &&
   data.hasOwnProperty('y') &&
   data.hasOwnProperty('width') &&
   data.hasOwnProperty('height')))
  {
   return null;
  }
  const detectionObject=new DetectionObject();
  detectionObject.id=data.id;
  detectionObject.probability=data.probability;
  detectionObject.x=data.x;
  detectionObject.y=data.y;
  detectionObject.width=data.width;
  detectionObject.height=data.height;
  detectionObject.detection=detection;
  if (data.hasOwnProperty('object'))
  {
   detectionObject.object=DetectableObject.Instance(data.object);
  }
  return detectionObject;
 }
}