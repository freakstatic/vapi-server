import { Component, OnInit } from '@angular/core';
import {SwPush} from '@angular/service-worker';
import {NotificationsService} from "./notifications.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
    param = {value: 'world'};

    readonly VAPID_PUBLIC_KEY = 'BFE4GlwPRGEyykZgCBZ6WLwCIPHLoal9Tffs225gQkk0KetZyHVnh4ml-apTDu6g6tUacvl1IC8UfQpargMyZMk';

    constructor(private swPush: SwPush, private notificationsService: NotificationsService) {}


  ngOnInit() {

  }

  askPermission(){
      this.swPush.requestSubscription({
          serverPublicKey: this.VAPID_PUBLIC_KEY
      })
          .then((sub: PushSubscription) => {
              console.log(sub);
              this.notificationsService.addSubscription(sub);
          })
          .catch(err => console.error('Could not subscribe to notifications', err));
  }
}
