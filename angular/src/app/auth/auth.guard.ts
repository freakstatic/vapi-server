import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate
{
 constructor(
  private authService: AuthService)
 {}
 
 canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>
 {
  return new Promise<boolean>((resolve) =>
  {
   if (!this.authService.checkLogin())
   {
    resolve(false);
    return;
   }
   resolve(true);
  });
 }
}
