import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {CredentialsManagerService} from './auth/credentials.manager.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{
 constructor(private credentialsManager: CredentialsManagerService)
 {
 }
 
 intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
 {
  if (req.url.match('\.\/assets\/i18n\/([^]{2}.json)') || ((req.url === 'api/login') && !this.credentialsManager.checkLogin()))
  {
   return next.handle(req);
  }
  const authReq = req.clone({
   setHeaders: {
    Authorization: 'Bearer ' + this.credentialsManager.getLogin.token,
    Language: localStorage.getItem('language')
   }
  });
  
  return next.handle(authReq);
 }
}
