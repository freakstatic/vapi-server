import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';

import {AppRoutingModule} from './app.routing';
import {ComponentsModule} from './components/components.module';

import {AppComponent} from './app.component';

import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {AuthService} from './auth/auth.service';
import {DashboardService} from './dashboard/dashboard.service';
import {SettingsService} from './settings/settings.service';
import {AuthGuard} from './auth/auth.guard';
import {TitleService} from './title.service';
import {TimelapsesService} from './timelapses/timelapses.service';
import {CredentialsManagerService} from './auth/credentials.manager.service';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './auth.interceptor';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {environment} from '../environments/environment';
import {LoginComponent} from './login/login.component';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {AuthLoginGuard} from './auth/auth.login.guard';
import {ServiceWorkerModule} from '@angular/service-worker';
import {NotificationsService} from './notifications/notifications.service';
import {UserListService} from './user-list/user-list.service';
import {UserDetailsModalComponent} from './user-details-modal/user-details-modal.component';
import {MAT_LABEL_GLOBAL_OPTIONS, MatButtonModule, MatDialogModule, MatInputModule, MatSelectModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';

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
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        ReactiveFormsModule,
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
        AppComponent,
        AdminLayoutComponent,
        LoginComponent,
        UserDetailsModalComponent
    ],
    entryComponents: [
        UserDetailsModalComponent
    ],
    providers: [
        FormsModule,
        AuthService, AuthGuard, AuthLoginGuard, TitleService, SettingsService, DashboardService, TimelapsesService, NotificationsService,
        CredentialsManagerService, UserListService,{
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {provide: MAT_DATE_LOCALE, useValue: 'pt'},
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
        {provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: {float: 'always'}}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}
