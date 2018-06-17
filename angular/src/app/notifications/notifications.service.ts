import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {NavbarComponent} from "../components/navbar/navbar.component";

@Injectable()
export class NotificationsService {

    constructor(private http: HttpClient) {
    }


    addSubscription(sub: PushSubscription) {
        this.http.post(environment.apiEndpoint + 'subscription/add', sub).toPromise().then(() => {
            NavbarComponent.showMessage('Added');
        })
    }
}
