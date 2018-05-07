import {Component, OnInit} from '@angular/core';
import { environment } from './../../environments/environment';
import {Http} from '@angular/http';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from "@angular/router";
import {AppComponent} from "../app.component";
declare var $: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    showNav: boolean;
    username: string;
    password: string;
    usernameEmpty : boolean = false;
    passwordEmpty: boolean = false;

    constructor(private appComponent: AppComponent, private http: HttpClient,
                private authService: AuthService,
                private translateService: TranslateService, private router: Router) {
        this.showNav = true;
        this.username = '';
        this.password = '';
    }

    ngOnInit() {
        this.authService.checkLogin().then((isLoggedIn) => {
            if (isLoggedIn){
                this.router.navigate(['/']);
                this.translateService.get('WELCOME_BACK').subscribe((res: string) => {
                    $.notify({
                        icon: 'material-icons',
                        message:  res
                    },{
                        type: 'success',
                        timer: 2000,
                    });
                });
            }
        })
    }


    login() {
        this.usernameEmpty = false;
        this.passwordEmpty = false;

        if (this.username.trim().length == 0) {
            this.usernameEmpty = true;
        }

        if (this.password.trim().length == 0) {
            this.passwordEmpty = true;
        }

        if (this.usernameEmpty || this.passwordEmpty) {
            return;
        }

        this.authService.login(this.username, this.password).then(() => {
            this.router.navigate(['/']);
        }).catch((error) => {
            let messageKey;
            if (error.code) {
                messageKey = 'ERROR-' + error.code;
            } else {
                messageKey = 'ERROR_NO_CONNECTION';
            }
            this.translateService.get(messageKey).subscribe((res: string) => {
                this.appComponent.showErrorMessage(res);
            });

        })
    }
}
