import {HttpClient, HttpClientModule} from "@angular/common/http";
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {DashboardService} from 'app/service/dashboard.service';

import {AppComponent} from './app.component';

import {AppRoutingModule} from './app.routing';
import {AuthGuard} from './auth/auth.guard';
import {AuthService} from './auth/auth.service';
import {ComponentsModule} from './components/components.module';

import {DashboardComponent} from './dashboard/dashboard.component';
import {IconsComponent} from './icons/icons.component';
import {LoginComponent} from './login/login.component';
import {MapsComponent} from './maps/maps.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {SettingsComponent} from './settings/settings.component';
import {SettingsService} from "./settings/settings.service";
import {TableListComponent} from './table-list/table-list.component';
import {TitleService} from "./title.service";
import {TypographyComponent} from './typography/typography.component';
import {UpgradeComponent} from './upgrade/upgrade.component';
import {UserProfileComponent} from './user-profile/user-profile.component';


export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        UserProfileComponent,
        TableListComponent,
        TypographyComponent,
        IconsComponent,
        MapsComponent,
        NotificationsComponent,
        UpgradeComponent,
        LoginComponent,
        SettingsComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        ComponentsModule,
        RouterModule,
        AppRoutingModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        })
    ],
    providers: [AuthService, AuthGuard, TitleService, SettingsService,DashboardService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
