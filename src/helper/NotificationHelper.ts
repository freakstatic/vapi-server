import * as fs from "fs";

const webpush = require('web-push');
const vapidKeys = JSON.parse(fs.readFileSync(__dirname + '/../../vapid-keys.json', "utf8"));

export class NotificationHelper {

    constructor(){
        webpush.setVapidDetails(
            'mailto:example@localhost',
            vapidKeys.publicKey,
            vapidKeys.privateKey
        );
    }

    sendNotification(sub, message){
        const notificationPayload = {
            "notification": {
                "title": "VAPi",
                "body": message,
                "icon": "assets/icons/icon-72x72.png",
                "data": {
                    "dateOfArrival": Date.now(),
                },
            }
        };
        webpush.sendNotification(sub, JSON.stringify(notificationPayload));
    }
}