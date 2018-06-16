import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';


import {AppRoutingModule} from './app.routing';
import {ComponentsModule} from './components/components.module';

import {AppComponent} from './app.component';

import {DashboardComponent} from './dashboard/dashboard.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {TableListComponent} from './table-list/table-list.component';
import {TypographyComponent} from './typography/typography.component';
import {IconsComponent} from './icons/icons.component';

import {NotificationsComponent} from './notifications/notifications.component';
import {
    AgmCoreModule
} from '@agm/core';
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {AuthService} from "./auth/auth.service";
import {DashboardService} from "./dashboard/dashboard.service";
import {SettingsService} from "./settings/settings.service";
import {AuthGuard} from "./auth/auth.guard";
import {TitleService} from "./title.service";
import {TimelapsesService} from "./timelapses/timelapses.service";
import {CredentialsManagerService} from "./auth/credentials.manager.service";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./auth.interceptor";
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import {environment} from "../environments/environment";
import {LoginComponent} from "./login/login.component";



import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MatDatetimepickerModule} from "@mat-datetimepicker/core";
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {AuthLoginGuard} from "./auth/auth.login.guard";


export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const config: SocketIoConfig = {
    url: environment.socketURL, options: {
        reconnection: true,
        reconnectionAttempts: 3
    }
};

@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        ComponentsModule,
        RouterModule,
        AppRoutingModule,
        SocketIoModule.forRoot(config),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        LoginComponent
    ],
    providers: [
        FormsModule,
        AuthService, AuthGuard, AuthLoginGuard, TitleService, SettingsService, DashboardService, TimelapsesService,
        CredentialsManagerService, {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {provide: MAT_DATE_LOCALE, useValue: 'pt'},
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}
