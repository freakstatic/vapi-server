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
}