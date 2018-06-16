import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AdminLayoutRoutes} from './admin-layout.routing';
import {DashboardComponent} from '../../dashboard/dashboard.component';
import {UserProfileComponent} from '../../user-profile/user-profile.component';
import {TableListComponent} from '../../table-list/table-list.component';
import {TypographyComponent} from '../../typography/typography.component';
import {IconsComponent} from '../../icons/icons.component';
import {NotificationsComponent} from '../../notifications/notifications.component';
import {UpgradeComponent} from '../../upgrade/upgrade.component';

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

    ],
    declarations: [
        DashboardComponent,
        UserProfileComponent,
        TableListComponent,
        TypographyComponent,
        IconsComponent,
        NotificationsComponent,
        UpgradeComponent,
        DashboardComponent,
        UserProfileComponent,
        TableListComponent,
        TypographyComponent,
        IconsComponent,
        NotificationsComponent,
        UpgradeComponent,
        SettingsComponent,
        TimelapsesComponent,
        UserListComponent,
    ]
})

export class AdminLayoutModule {
    constructor(
        private socket: Socket,
        private credentialsManager: CredentialsManagerService, translate: TranslateService
    ) {
        translate.setDefaultLang('en');
        this.socket.on('connect', () => {
            if (this.credentialsManager.checkLogin()) {
                this.socket.emit('authenticate', this.credentialsManager.getLogin.token);
            }
        });
    }
}
