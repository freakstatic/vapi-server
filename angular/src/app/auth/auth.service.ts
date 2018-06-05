import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
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
   let headers=new HttpHeaders();
   headers.append('Authorization','Basic '+btoa(username+':'+password));
   // headers.append('Content-Type','application/json');
   this.http.post('api/login',null,{headers:headers}).subscribe(() =>
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

 checkLogin():boolean
 {
  let token=localStorage.getItem('token');
  let checkLoggedIn=token!=null&&token!=undefined&&token.trim().length<1;
  if(this.loggedIn.getValue()!=checkLoggedIn)
  {
   this.loggedIn.next(checkLoggedIn);
  }

  return checkLoggedIn;
 }
}