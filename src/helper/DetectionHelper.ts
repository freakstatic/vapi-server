import {DetectionImage} from '../entity/DetectionImage';
import {DetectionObject} from '../entity/DetectionObject';
import {DetectableObjectRepository} from '../repository/DetectableObjectRepository';
import {DetectionEvent} from '../entity/DetectionEvent';
import {DetectableObject} from '../entity/DetectableObject';
import {getConnection} from 'typeorm';
import {Detection} from '../entity/Detection';
import {DetectionEventRepository} from '../repository/DetectionEventRepository';
import {DetectionRepository} from '../repository/DetectionRepository';
import {unlink} from 'fs';
import {NotificationHelper} from './NotificationHelper';

export class DetectionHelper {

    private lastDetection: Detection;
    private lastDetectionEvent: DetectionEvent;

    private notificationHelper: NotificationHelper;

    private static readonly DELAY_UNTIL_CLOSE_EVENT = 2000;

    constructor(notificationHelper: NotificationHelper) {
        this.notificationHelper = notificationHelper;
    }

    async fixUnfishedEvents() {
        let detectionEventRepositoryRepository = getConnection().getCustomRepository(DetectionEventRepository);
        let lastDetectionEvent = await detectionEventRepositoryRepository.getLast();

        if (lastDetectionEvent == null) {
            return;
        }

        if (lastDetectionEvent.endDate != null || lastDetectionEvent.detections.length == 0) {
            return;
        }

        let lastDetection = lastDetectionEvent.detections[lastDetectionEvent.detections.length - 1];


        lastDetectionEvent.endDate = lastDetection.date;
        await detectionEventRepositoryRepository.save(lastDetectionEvent);

    }

    async handleDetectionReceived(detectionReceived): Promise<Detection> {
        try {

            let currentDate = new Date();
            let detectionEventRepository = getConnection().getRepository(DetectionEvent);
            let detectionObjectRepository = getConnection().getRepository(DetectionObject);
            let detectableObjectRepository = getConnection().getCustomRepository(DetectableObjectRepository);

            if (detectionReceived.objects.length === 0 && this.lastDetection == null) {
                unlink(detectionReceived.imgUrl, (err) => {
                    if (err) {
                        console.error('[DetectionHelper] [handleDetectionReceived] Unable to delete file with no detections');
                        console.error(err);
                    }
                });
                return null;
            }

            if (detectionReceived.objects.length === 0) {
                let milisecondsPassed = currentDate.getTime() - this.lastDetection.date.getTime();

                if (milisecondsPassed > DetectionHelper.DELAY_UNTIL_CLOSE_EVENT) {
                    this.lastDetectionEvent.endDate = currentDate;
                    await detectionEventRepository.save(this.lastDetectionEvent);
                    this.lastDetection = null;
                    this.lastDetectionEvent = null;
                }
                return null;
            }


            // let detectionReceivedEqualToLast = detectionReceived.objects.every((detectionObject, index) => {
            //     return detectionObject.className === this.lastDetection.detectionObjects[index];
            // });
            //
            // if (detectionReceivedEqualToLast){
            //     this.lastDetection.image.push()
            // }


            let detection = new Detection();
            detection.date = currentDate;


            detection.image = new DetectionImage();
            detection.image.path = detectionReceived.imgUrl;
            detection.image.dateCreated = currentDate;
            await getConnection().getRepository(DetectionImage).insert(detection.image);

            detection.numberOfDetections = detectionReceived.objects.length;
            await getConnection().getRepository(Detection).insert(detection);

            let detectionObjects = Promise.all(await <Promise<DetectionObject>[]> detectionReceived.objects.map(
                async (detectionObjectReceived): Promise<DetectionObject> => {

                    let detectionObject = new DetectionObject();

                    detectionObject.object = await detectableObjectRepository
                        .findByName(detectionObjectReceived.className);

                    if (detectionObject.object == undefined) {
                        detectionObject.object = new DetectableObject();
                        detectionObject.object.name = detectionObjectReceived.className;
                        detectionObject.object = await detectableObjectRepository.save(detectionObject.object);
                    }

                    detectionObject.probability = detectionObjectReceived.probability;
                    let box = detectionObjectReceived.box;
                    detectionObject.x = box.x;
                    detectionObject.y = box.y;
                    detectionObject.width = box.w;
                    detectionObject.height = box.h;
                    detectionObject.id = null;
                    detectionObject.detection = detection;

                    detectionObject = await detectionObjectRepository.save(detectionObject);
                    return detectionObject;
                }));
            this.lastDetection = detection;

            if (this.lastDetectionEvent == null) {
                let detectionEvent = new DetectionEvent();
                detectionEvent.startDate = currentDate;
                detectionEvent.detections = [detection];
                this.lastDetectionEvent = detectionEvent;
                await detectionEventRepository.save(detectionEvent);
            } else {
                this.lastDetectionEvent.detections.push(detection);
                await detectionEventRepository.save(this.lastDetectionEvent);
            }

            detection = await getConnection().getCustomRepository(DetectionRepository).getByIdWithRelations(detection.id);

            detection.event = this.lastDetectionEvent;
            this.notificationHelper.notifyAboutDetection(detection).catch((err) => {
                console.error('[DetectionHelper] [handleDetectionReceived] Unable to notify about detection', err);
            });

            return detection;
        }
        catch (e) {
            console.error(e);
        }

    }
}