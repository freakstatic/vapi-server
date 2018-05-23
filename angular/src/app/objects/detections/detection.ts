import {DetectionObject} from 'app/objects/detections/detection.object';

export class Detection
{
 id: number;
 date: Date;
 detectionObjects: DetectionObject[];
 numberOfDetections: number;
}