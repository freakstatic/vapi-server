import {DetectableObject} from 'app/dto/detections/detectable.object';
import {Detection} from 'app/dto/detections/detection';

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
}