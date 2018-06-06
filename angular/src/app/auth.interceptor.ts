import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {CredentialsManagerService} from './auth/credentials.manager.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{
 constructor(private credentialsManager: CredentialsManagerService)
 {}

 intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
 {
  if (req.url.match("./assets/i18n/([^][^].json)"))
  {
   return next.handle(req);
  }
  let authReq = req;
  if (req.url.match("api/login") && !this.credentialsManager.checkLogin())
  {
   authReq = req.clone({
    setHeaders: {
     Authorization: "Basic " + btoa(req.body.username + ':' + req.body.password)
    },
    body: null
   });
  }
  else
  {
   authReq = req.clone({
    setHeaders: {
     Authorization: "Bearer " + this.credentialsManager.getLogin.token
    }
   });
  }
  return next.handle(authReq);
 }
}
