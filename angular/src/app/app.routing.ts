import {NgModule} from '@angular/core';
import {CommonModule,} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {Routes, RouterModule} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {TableListComponent} from './table-list/table-list.component';
import {TypographyComponent} from './typography/typography.component';
import {IconsComponent} from './icons/icons.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {UpgradeComponent} from './upgrade/upgrade.component';
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./auth/auth.guard";
import {SettingsComponent} from "./settings/settings.component";
import {UserListComponent} from "./user-list/user-list.component";
import {TimelapsesComponent} from "./timelapses/timelapses.component";

const routes: Routes = [
    {path: 'login', component: LoginComponent, data: {title: 'Login'}},
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: {title: 'Dashboard'}},
    {path: 'timelapses', component: TimelapsesComponent},
    {path: 'user-list', component: UserListComponent},
    {path: 'settings', component: SettingsComponent},


    {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
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
