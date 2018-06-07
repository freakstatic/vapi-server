import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {AngularDateTimePickerModule} from 'angular2-datetimepicker';

import {DashboardService} from 'app/dashboard/dashboard.service';
import {Ng2CompleterModule} from 'ng2-completer';
import {IonRangeSliderModule} from 'ng2-ion-range-slider';
import {Socket, SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {environment} from '../environments/environment';

import {AppComponent} from './app.component';

import {AppRoutingModule} from './app.routing';
import {AuthInterceptor} from './auth.interceptor';
import {AuthGuard} from './auth/auth.guard';
import {AuthService} from './auth/auth.service';
import {CredentialsManagerService} from './auth/credentials.manager.service';
import {ComponentsModule} from './components/components.module';

import {DashboardComponent} from './dashboard/dashboard.component';
import {IconsComponent} from './icons/icons.component';
import {LoginComponent} from './login/login.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {SettingsComponent} from './settings/settings.component';
import {SettingsService} from "./settings/settings.service";
import {TableListComponent} from './table-list/table-list.component';
import {TimelapsesComponent} from './timelapses/timelapses.component';
import {TimelapsesService} from './timelapses/timelapses.service';
import {TitleService} from "./title.service";
import {TypographyComponent} from './typography/typography.component';
import {UpgradeComponent} from './upgrade/upgrade.component';
import {UserListComponent} from './user-list/user-list.component';
import {UserProfileComponent} from './user-profile/user-profile.component';

export function createTranslateLoader(http: HttpClient)
{
 return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const config: SocketIoConfig = {
 url: environment.socketURL, options: {
  reconnection: true,
  reconnectionAttempts: 3
 }
};

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
  TimelapsesComponent,
  UserListComponent
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
 providers: [AuthService, AuthGuard, TitleService, SettingsService, DashboardService, TimelapsesService, CredentialsManagerService, {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
 }],
 bootstrap: [AppComponent]
})

export class AppModule
{
 constructor(private socket: Socket, private credentialsManager: CredentialsManagerService)
 {
  this.socket.on('connect', () =>
  {
   if (this.credentialsManager.checkLogin())
   {
    this.socket.emit('authenticate', this.credentialsManager.getLogin.token);
   }
  });
 }
}
