import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate
{
 constructor(
  private authService: AuthService, private router: Router)
 {}

 canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>
 {
  return new Promise<boolean>((resolve) =>
  {
   if (!this.authService.checkLogin())
   {
       this.router.navigate(['']);
    resolve(false);
    return;
   }
   resolve(true);
  });
 }
}
