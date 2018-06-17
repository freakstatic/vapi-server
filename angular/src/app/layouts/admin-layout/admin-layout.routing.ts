import {Routes} from '@angular/router';

import {DashboardComponent} from '../../dashboard/dashboard.component';
import {SettingsComponent} from "../../settings/settings.component";
import {UserListComponent} from "../../user-list/user-list.component";
import {TimelapsesComponent} from "../../timelapses/timelapses.component";
import {LoginComponent} from "../../login/login.component";
import {AuthGuard} from "../../auth/auth.guard";
import {NotificationsComponent} from "../../notifications/notifications.component";

export const AdminLayoutRoutes: Routes = [
    {path: 'dashboard', component: DashboardComponent, data: {title: 'Dashboard'}},
    {path: 'timelapses', component: TimelapsesComponent},
    {path: 'user-list', component: UserListComponent},
    {path: 'notifications', component: NotificationsComponent},
    {path: 'settings', component: SettingsComponent},
];
