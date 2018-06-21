import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AdminLayoutRoutes} from './admin-layout.routing';
import {DashboardComponent} from '../../dashboard/dashboard.component';

import {
    MatButtonModule, MatDatepickerModule, MatInputModule, MatRippleModule, MatTooltipModule,
    MatNativeDateModule, MatSelectModule
} from '@angular/material';
import {LoginComponent} from "../../login/login.component";
import {TimelapsesComponent} from "../../timelapses/timelapses.component";
import {UserListComponent} from "../../user-list/user-list.component";
import {SettingsComponent} from "../../settings/settings.component";
import {HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {Socket, SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import {environment} from "../../../environments/environment";
import {CredentialsManagerService} from "../../auth/credentials.manager.service";

import {Ng2CompleterModule} from "ng2-completer";
import {IonRangeSliderModule} from "ng2-ion-range-slider";
import {AngularDateTimePickerModule} from "angular2-datetimepicker";

import {AmazingTimePickerModule} from "amazing-time-picker";
import {ServiceWorkerModule} from "@angular/service-worker";
import {NotificationsComponent} from "../../notifications/notifications.component";


export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        MatButtonModule,
        MatRippleModule,
        MatInputModule,
        MatTooltipModule,
        Ng2CompleterModule,
        AngularDateTimePickerModule,
        AmazingTimePickerModule,
        IonRangeSliderModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
    ],
    declarations: [
        DashboardComponent,
        DashboardComponent,
        SettingsComponent,
        TimelapsesComponent,
        UserListComponent,
        NotificationsComponent
    ]
})

export class AdminLayoutModule {
    constructor(
        private socket: Socket,
        private credentialsManager: CredentialsManagerService, translate: TranslateService
    ) {
        translate.setDefaultLang(localStorage.getItem('language'));
        translate.use(localStorage.getItem('language') );

        this.socket.on('connect', () => {
            if (this.credentialsManager.checkLogin()) {
                this.socket.emit('authenticate', this.credentialsManager.getLogin.token);
            }
        });
    }
}
