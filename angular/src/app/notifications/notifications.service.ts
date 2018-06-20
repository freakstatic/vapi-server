import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {NavbarComponent} from '../components/navbar/navbar.component';

@Injectable()
export class NotificationsService {

    constructor(private http: HttpClient) {
    }


    addSubscription(sub: PushSubscription) {
        return this.http.post(environment.apiEndpoint + 'notification/subscription/add', sub).toPromise();
    }

    getDetectableObjects() {
        return this.http.get(environment.apiEndpoint + 'detectable-objects').toPromise();
    }

    getSubscriptionDetectableObjects(sub: PushSubscription) {
        return this.http.post(environment.apiEndpoint + 'notification/subscription/detectable-objects', sub)
            .toPromise();
    }

    addSubscriptionDetectableObjects(sub, subscriptionDetectableObjects: any[]) {
        return this.http.post(environment.apiEndpoint + 'notification/subscription/detectable-objects/add', {
            sub: sub,
            subscriptionDetectableObjects: subscriptionDetectableObjects
        }).toPromise();
    }


}
