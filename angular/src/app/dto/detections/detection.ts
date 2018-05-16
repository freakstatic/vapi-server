import {DetectionObject} from 'app/dto/detections/detection.object';

export class Detection
{
 id: number;
 date: Date;
 detectionObjects: DetectionObject[];
 numberOfDetections: number;
}