import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "./auth/auth.guard";

import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from "./login/login.component";
import {SettingsComponent} from "./settings/settings.component";
import {TimelapsesComponent} from './timelapses/timelapses.component';
import {UserListComponent} from './user-list/user-list.component';

const routes: Routes = [
 {path: 'login', component: LoginComponent, data: {title: 'Login'}},
 {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: {title: 'Dashboard'}},
 {path: 'timelapses', component: TimelapsesComponent},
 {path: 'user-list', component: UserListComponent},
 {path: 'settings', component: SettingsComponent},
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
