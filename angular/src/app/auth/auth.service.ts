import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Socket} from 'ngx-socket-io';
import {CredentialsManagerService} from './credentials.manager.service';

@Injectable()
export class AuthService
{
 constructor(private router: Router, private credentialManager:CredentialsManagerService,private http: HttpClient, private socket: Socket)
 {

 }

 get isLoggedIn()
 {
  return this.credentialManager.isLoggedIn.asObservable();
 }

 login(username: string, password: string)
 {
  return new Promise((resolve, reject) =>
  {
   this.http.post('api/login',{username:username,password:password}).subscribe(() =>
   {
    this.credentialManager.token="";
    this.socket.emit('authenticate', JSON.stringify({username: username, password: password}));
    //localStorage.setItem('token',JSON.stringify(new Login()))
    resolve();
   }, (errorResponse: HttpErrorResponse) =>
   {
    reject(errorResponse);
   });
  })
 }


 logout()
 {
  this.credentialManager.cleanToken();
  this.router.navigate(['/login']);
 }

 checkLogin(): boolean
 {
  return this.credentialManager.checkLogin();
 }
}