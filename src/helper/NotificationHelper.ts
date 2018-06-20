import * as fs from "fs";
import {NotificationSubscription} from "../entity/NotificationSubscription";
import {getConnection, Repository} from "typeorm";
import {DetectableObject} from "../entity/DetectableObject";
import {Detection} from "../entity/Detection";
import {DetectableObjectRepository} from "../repository/DetectableObjectRepository";
import ErrnoException = NodeJS.ErrnoException;
import {InvalidSubcriptionException} from "../exception/InvalidSubcriptionException";

const webpush = require('web-push');
const vapidKeys = JSON.parse(fs.readFileSync(__dirname + '/../../vapid-keys.json', "utf8"));

export class NotificationHelper {

    private notificationSubscriptionRepository: Repository<NotificationSubscription>;
    private lastNotifiedDetection: Detection;
    private i18n;
    constructor(i18n) {
        this.i18n = i18n;
        webpush.setVapidDetails(
            'mailto:example@localhost',
            vapidKeys.publicKey,
            vapidKeys.privateKey
        );
        this.notificationSubscriptionRepository = getConnection().getRepository(NotificationSubscription);
    }

    send(notificationSubscription: NotificationSubscription, message) {
        const notificationPayload = {
            "notification": {
                "title": "VAPi",
                "body": message,
                "icon": "assets/icons/android-icon-72x72.png",
                "data": {
                    "dateOfArrival": Date.now(),
                },
            }
        };
        let sub = {
            endpoint: notificationSubscription.endpoint,
            keys: {
                auth: notificationSubscription.auth,
                p256dh: notificationSubscription.p256dh
            }
        };

        webpush.sendNotification(sub, JSON.stringify(notificationPayload)).catch((err) => {
            console.error('[NotificationHelper] [send] webpush failed to send notification', err);

            if (err.statusCode == 410){
                console.error('[NotificationHelper] [send] webpush failed 410 removing subscription');
                this.notificationSubscriptionRepository.remove(notificationSubscription);
            }
        });

    }

    async handleNewSubscription(sub, language) {
        let notificationSubscription = await this.getSubscription(sub.keys.auth);

        if (notificationSubscription != null) {
            return notificationSubscription;
        }

        notificationSubscription = new NotificationSubscription();
        notificationSubscription.endpoint = sub.endpoint;
        notificationSubscription.auth = sub.keys.auth;
        notificationSubscription.p256dh = sub.keys.p256dh;
        notificationSubscription.language = language;

        await  this.notificationSubscriptionRepository.save(notificationSubscription);
    }

    async getSubscription(auth): Promise<NotificationSubscription> {
        return this.notificationSubscriptionRepository.findOne({
            auth: auth
        }, {
            relations: ["detectableObjects"]
        });
    }

    async getSubscriptionDetectableObjects(auth) {
        let notificationSubscription = await this.getSubscription(auth);

        if (notificationSubscription == null) {
            return [];
        }

        return notificationSubscription.detectableObjects;
    }


    async addSubscriptionDetectableObjects(sub, detectableObjects: DetectableObject[]) {
        if (!sub.keys){
            throw new InvalidSubcriptionException;
        }

        let notificationSubscription = await this.getSubscription(sub.keys.auth);
        notificationSubscription.detectableObjects = detectableObjects;
        await this.notificationSubscriptionRepository.save(notificationSubscription);
    }

    async notifyAboutDetection(detection: Detection) {
        let detectionObjectsToNotify = [];
        if (this.lastNotifiedDetection != null && this.lastNotifiedDetection.event.id == detection.event.id) {
            let detectionObjects = await detection.detectionObjects;
            let lastDetectionObjects = await this.lastNotifiedDetection.detectionObjects;

            for (let detectionObject of detectionObjects) {
                detectionObject.object = await getConnection().getCustomRepository(DetectableObjectRepository).findByDetectionObject(detectionObject.id);

                let detectableObjectAlreadyNotified = lastDetectionObjects.some((lastDetectionObject) => {
                    return lastDetectionObject.object.name == detectionObject.object.name
                });

                if (!detectableObjectAlreadyNotified) {
                    detectionObjectsToNotify.push(detectionObject);
                }
            }
        } else {
            detectionObjectsToNotify = await detection.detectionObjects;
        }

        for (let detectionObject of detectionObjectsToNotify) {
            detectionObject.object = await getConnection().getCustomRepository(DetectableObjectRepository).findByDetectionObject(detectionObject.id);
        }

        let detectableObjectsToNotify = [];
        for (let detectionObject of detectionObjectsToNotify) {

            let alreadyInArray = detectableObjectsToNotify.some((newDetectionDetectableObject) => {
                return newDetectionDetectableObject.name != detectionObject.object.name
            });
            if (!alreadyInArray) {
                detectableObjectsToNotify.push(detectionObject.object);
            }
        }

        detectableObjectsToNotify.forEach(async (detectableObjectToNotify) => {
            let notificationSubscriptionsToNotify = await this.notificationSubscriptionRepository.createQueryBuilder('notificationSubscription')
                .leftJoinAndSelect('notificationSubscription.detectableObjects', 'detectableObject')
                .where("detectableObject.id = :id", {id: detectableObjectToNotify.id})
                .getMany();

            notificationSubscriptionsToNotify.forEach((notifySubscription) => {

                try {
                    this.i18n.setLocale(notifySubscription.language);
                    let message = this.i18n.__('DETECTED', {name: detectableObjectToNotify.name});
                    this.send(notifySubscription,  message);
                } catch (e) {
                    console.error('[NotificationHelper] [notifyAboutDetection] Unable to send notification');
                }
            });
        });
        this.lastNotifiedDetection = detection;
    }

}