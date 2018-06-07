import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';

import {DashboardService} from 'app/dashboard/dashboard.service';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {environment} from './../environments/environment';

import {AppRoutingModule} from './app.routing';
import {ComponentsModule} from './components/components.module';

import {AppComponent} from './app.component';

import {DashboardComponent} from './dashboard/dashboard.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {TableListComponent} from './table-list/table-list.component';
import {TypographyComponent} from './typography/typography.component';
import {IconsComponent} from './icons/icons.component';

import {NotificationsComponent} from './notifications/notifications.component';
import {UpgradeComponent} from './upgrade/upgrade.component';
import {LoginComponent} from './login/login.component';
import {AuthService} from './auth/auth.service';
import {AuthGuard} from './auth/auth.guard';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TitleService} from "./title.service";
import { SettingsComponent } from './settings/settings.component';
import {SettingsService} from "./settings/settings.service";
import { UserListComponent } from './user-list/user-list.component';
import { TimelapsesComponent } from './timelapses/timelapses.component';
import { TimelapsesService } from './timelapses/timelapses.service';
import { Ng2CompleterModule } from "ng2-completer";
import {AngularDateTimePickerModule} from "angular2-datetimepicker";
import { IonRangeSliderModule } from "ng2-ion-range-slider";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const config: SocketIoConfig = {url: environment.socketURL, options: {}};

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        UserProfileComponent,
        TableListComponent,
        TypographyComponent,
        IconsComponent,
        NotificationsComponent,
        UpgradeComponent,
        LoginComponent,
        SettingsComponent,
        UserListComponent,
        TimelapsesComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        ComponentsModule,
        RouterModule,
        AppRoutingModule,
        HttpClientModule,
        Ng2CompleterModule,
        AngularDateTimePickerModule,
        IonRangeSliderModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        SocketIoModule.forRoot(config)
    ],
    providers: [AuthService, AuthGuard, TitleService, SettingsService, DashboardService, TimelapsesService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
