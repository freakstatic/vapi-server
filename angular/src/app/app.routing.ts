import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';

import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './auth/auth.guard';
import {AuthLoginGuard} from './auth/auth.login.guard';

const routes: Routes = [
 {
  path: '', component: LoginComponent, data: {title: 'Login'},
  pathMatch: 'full',
  canActivate: [AuthLoginGuard]
 },
 {
  path: '',
  component: AdminLayoutComponent,
  children: [
   {
    path: '',
    loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
   }],
  canActivate: [AuthGuard]
 }
];

@NgModule({
 imports: [
  CommonModule,
  BrowserModule,
  RouterModule.forRoot(routes)
 ],
 exports: []
})
export class AppRoutingModule
{
}
