import {DetectionObject} from 'app/objects/detections/detection.object';

export class Detection
{
 id: number;
 date: Date;
 detectionObjects: DetectionObject[];
 numberOfDetections: number;

 public static NewInstanceFromDetectionSocket(data:any):Detection
 {
  let detection=new Detection();
  detection.id=data.id;
  detection.numberOfDetections=data.numberOfDetections;
  detection.date=new Date(data.date);
  return detection;
 }
}