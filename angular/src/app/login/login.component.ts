import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../auth/auth.service';
import {NavbarComponent} from '../components/navbar/navbar.component';

declare var $: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    param = {value: 'world'};
    showNav: boolean;
    username: string ;
    password: string ;
    usernameEmpty = false;
    passwordEmpty = false;

    constructor(private http: HttpClient,
                private authService: AuthService,
                private translateService: TranslateService, private router: Router) {
        this.showNav = true;
        this.username = 'test';
        this.password = 'test';
    }

    ngOnInit() {
        if (this.authService.checkLogin()) {
            this.translateService.get('WELCOME_BACK').subscribe((res: string) => {
                $.notify({
                    icon: 'material-icons',
                    message: res
                }, {
                    type: 'success',
                    timer: 2000
                });
            });
        }
    }

    login() {
        this.usernameEmpty = false;
        this.passwordEmpty = false;

        if (this.username.trim().length === 0) {
            this.translateService.get('ERROR-EMPTY_USERNAME').toPromise()
                .then((res: string) => {
                    NavbarComponent.showErrorMessage(res);
                });
            this.usernameEmpty = true;
        }

        if (this.password.trim().length === 0) {
            this.translateService.get('ERROR-EMPTY_PASSWORD').toPromise()
                .then((res: string) => {
                    NavbarComponent.showErrorMessage(res);
                });
            this.passwordEmpty = true;
        }

        if (this.usernameEmpty || this.passwordEmpty) {
            return;
        }

        this.authService.login(this.username, this.password)
            .then(() => {
                this.router.navigate(['/dashboard']);
            })
            .catch((error) => {
                let messageKey;
                if (error.code) {
                    messageKey = 'ERROR-' + error.code;
                }
                else {
                    messageKey = 'ERROR_NO_CONNECTION';
                }
                this.translateService.get(messageKey).subscribe((res: string) => {
                    NavbarComponent.showErrorMessage(res);
                });

            });
    }

}
