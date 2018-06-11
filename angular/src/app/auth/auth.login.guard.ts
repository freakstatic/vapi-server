import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class AuthLoginGuard implements CanActivate
{
 constructor(private authService: AuthService, private router: Router)
 {}
 
 canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>
 {
  return new Promise<boolean>((resolve) =>
  {
   if (this.authService.checkLogin())
   {
    this.router.navigate(['/dashboard']);
    resolve(false);
    return;
   }
   resolve(true);
  });
 }
}
