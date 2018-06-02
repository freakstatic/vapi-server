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

const routes: Routes = [
    {path: 'login', component: LoginComponent, data: {title: 'Login'}},
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: {title: 'Dashboard'}},
    {path: 'user-manager', component: UserProfileComponent},
    {path: 'settings', component: SettingsComponent},

    {path: 'user-profile', component: UserProfileComponent},
    {path: 'table-list', component: TableListComponent},
    {path: 'typography', component: TypographyComponent},
    {path: 'icons', component: IconsComponent},
    {path: 'notifications', component: NotificationsComponent},
    {path: 'upgrade', component: UpgradeComponent},
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
