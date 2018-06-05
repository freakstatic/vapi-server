import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Socket} from 'ngx-socket-io';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Login} from '../objects/login';

@Injectable()
export class AuthService
{
 private loggedIn = new BehaviorSubject<boolean>(true);

 constructor(private router: Router, private http: HttpClient, private socket: Socket)
 {
 }

 get isLoggedIn()
 {
  return this.loggedIn.asObservable();
 }

 login(username: string, password: string)
 {
  return new Promise((resolve, reject) =>
  {
   this.http.post('api/login',null).subscribe(() =>
   {
    this.loggedIn.next(true);
    this.socket.emit('authenticate', {username: username, password: password});
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
  localStorage.setItem('token',undefined);
  this.loggedIn.next(false);
  this.router.navigate(['/login']);
 }

 checkLogin(): boolean
 {
  let token = localStorage.getItem('token');
  let checkLoggedIn = token != null && token != undefined && token.trim().length < 1;
  if (!checkLoggedIn)
  {
   if(checkLoggedIn!=this.loggedIn.getValue())
   {
    this.loggedIn.next(false);
   }
   return false;
  }

  let login: Login = JSON.parse(token);
  checkLoggedIn = login.token != null && login.token != undefined && login.token.trim().length < 1;
  if (!checkLoggedIn)
  {
   if(checkLoggedIn!=this.loggedIn.getValue())
   {
    this.loggedIn.next(false);
   }
   return false;
  }
  let date = new Date();
  checkLoggedIn = login.timestamp.getTime() > date.getTime();
  if(checkLoggedIn!=this.loggedIn.getValue())
  {
   this.loggedIn.next(checkLoggedIn);
  }
  return checkLoggedIn;
 }
}