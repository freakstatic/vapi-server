import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "./auth/auth.guard";

import {DashboardComponent} from './dashboard/dashboard.component';
import {IconsComponent} from './icons/icons.component';
import {LoginComponent} from "./login/login.component";
import {MapsComponent} from './maps/maps.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {SettingsComponent} from "./settings/settings.component";
import {TableListComponent} from './table-list/table-list.component';
import {TypographyComponent} from './typography/typography.component';
import {UpgradeComponent} from './upgrade/upgrade.component';
import {UserProfileComponent} from './user-profile/user-profile.component';

const routes: Routes = [
    {path: 'login', component: LoginComponent, data: {title: 'Login'}},
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: {title: 'Dashboard'}},
    {path: 'user-manager', component: UserProfileComponent},
    {path: 'settings', component: SettingsComponent},

    {path: 'user-profile', component: UserProfileComponent},
    {path: 'table-list', component: TableListComponent},
    {path: 'typography', component: TypographyComponent},
    {path: 'icons', component: IconsComponent},
    {path: 'maps', component: MapsComponent},
    {path: 'notifications', component: NotificationsComponent},
    {path: 'upgrade', component: UpgradeComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes)
    ],
    exports: [],
})
export class AppRoutingModule {
}
