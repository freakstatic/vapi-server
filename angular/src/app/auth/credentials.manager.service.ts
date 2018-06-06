import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Login} from '../objects/login';

@Injectable()
export class CredentialsManagerService
{
 private loggedIn = new BehaviorSubject<boolean>(false);
 private login: Login = null;

 constructor() { }

 get isLoggedIn()
 {
  return this.loggedIn;
 }

 get getLogin(): Login
 {
  return this.login;
 }

 set token(token: string)
 {
  let login = new Login(token);
  if (!login.isValid())
  {
   return;
  }
  this.login=login;
  localStorage.setItem('token', token);
  this.loggedIn.next(true);
 }

 public checkLogin(): boolean
 {
  let token=localStorage.getItem('token')
  let valid=this.isValidToken(token);
  if (valid&&this.login==null)
  {
   this.login=new Login(token);
  }
  return valid;
 }

 public isValidToken(token: string): boolean
 {
  let checkLoggedIn = token != null && token != undefined && token.trim().length > 0;
  if (!checkLoggedIn)
  {
   if (checkLoggedIn != this.loggedIn.getValue())
   {
    this.loggedIn.next(false);
   }
   return false;
  }

  let login = new Login(token);
  checkLoggedIn = login.isValid();
  if (checkLoggedIn != this.loggedIn.getValue())
  {
   this.loggedIn.next(checkLoggedIn);
  }
  return checkLoggedIn;
 }

 public cleanToken()
 {
  localStorage.setItem('token', undefined);
  this.isLoggedIn.next(false);
  this.login=null;
 }
}
