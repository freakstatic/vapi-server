import {AfterViewInit, Component, OnInit} from '@angular/core';
import {SwPush} from '@angular/service-worker';
import {NotificationsService} from './notifications.service';
import {NavbarComponent} from '../components/navbar/navbar.component';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, AfterViewInit {
    param = {value: 'world'};

    readonly VAPID_PUBLIC_KEY = 'BFE4GlwPRGEyykZgCBZ6WLwCIPHLoal9Tffs225gQkk0KetZyHVnh4ml-apTDu6g6tUacvl1IC8UfQpargMyZMk';

    detectableObjects: any[];
    sub: PushSubscription;

    constructor(private swPush: SwPush, private notificationsService: NotificationsService,
                private translateService: TranslateService) {
    }


    ngOnInit() {
        this.notificationsService.getDetectableObjects()
            .then((detectableObjects: any[]) => {
                this.detectableObjects = detectableObjects;
            });
    }

    ngAfterViewInit() {
        console.log('after');
        this.askPermission();
    }

    askPermission() {
        this.swPush.requestSubscription({
            serverPublicKey: this.VAPID_PUBLIC_KEY
        }).then((sub: PushSubscription) => {
            this.sub = sub;

            this.notificationsService.addSubscription(sub).then(() => {
                console.log('[NotificationsComponent] [askPermission]');
                console.log(this);
                this.getSubscriptionDetectableObjects();
            }).catch((err) => {
                console.error('Unable to addSubscription', err);
            });
        }).catch(err => {
            console.error('Could not subscribe to notifications', err);
            this.translateService.get('NOTIFICATIONS_PLEASE_ALLOW_PERMISSIONS').subscribe((res: string) => {
                NavbarComponent.showErrorMessage(res);
            });
        });
    }

    getSubscriptionDetectableObjects() {

        if (this.sub == null) {
            return;
        }
        this.notificationsService.getSubscriptionDetectableObjects(this.sub).then((subscriptionDetectableObjects: any[]) => {
            if (subscriptionDetectableObjects == null || subscriptionDetectableObjects.length === 0){
                return;
            }

            subscriptionDetectableObjects.forEach((subscriptionDetectableObject) => {
                const detectableObjectFound = this.detectableObjects.find((detectableObject) => {
                    return detectableObject.name === subscriptionDetectableObject.name;
                });

                if (detectableObjectFound) {
                    detectableObjectFound.selected = true;
                }
            });
        }).catch((err) => {
            console.error('[NotificationsComponent] [getSubscriptionDetectableObjects] Unable to getSubscriptionDetectableObjects', err);
        });
    }

    save() {
        const subscriptionDetectableObjects = this.detectableObjects.filter((detectableObject) => {
            return detectableObject.selected;
        });

        this.notificationsService.addSubscriptionDetectableObjects(this.sub, subscriptionDetectableObjects).then(() => {
            NavbarComponent.showMessage('Notification settings saved');
        }).catch(() => {
            console.error('Error saving notification subscriptionDetectableObjects');
        });
    }
}
