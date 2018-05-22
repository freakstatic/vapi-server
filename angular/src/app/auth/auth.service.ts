import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Socket} from 'ngx-socket-io';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

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
   this.http.post('api/login', {username: username, password: password}).subscribe(() =>
   {
    this.loggedIn.next(true);
    this.socket.emit('authenticate', {username: username, password: password});
    resolve();
   }, (errorResponse: HttpErrorResponse) =>
   {
    reject(errorResponse);
   });
  })
 }


 logout()
 {
  this.loggedIn.next(false);
  this.router.navigate(['/login']);
 }

 checkLogin()
 {
  return new Promise((resolve, reject) =>
  {
   this.http.get('api/login/check').subscribe((response: any) =>
   {
    this.loggedIn.next(response.isLoggedIn);
    if (!response.isLoggedIn)
    {
     this.socket.emit('authenticate');
    }
    resolve(response.isLoggedIn);
   }, (error: HttpErrorResponse) =>
   {
    this.loggedIn.next(false);
    this.socket.emit('authenticate');
    resolve(false);
   });
  })
 }
}