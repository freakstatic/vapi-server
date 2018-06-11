import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Socket} from 'ngx-socket-io';
import {CredentialsManagerService} from './credentials.manager.service';

@Injectable()
export class AuthService {
    private refreshingToken: boolean;

    constructor(private router: Router, private credentialManager: CredentialsManagerService, private http: HttpClient, private socket: Socket) {
        this.refreshingToken = false;
        this.credentialManager.isTokenBecomeInvalid.subscribe((data: boolean) => {
            if (data && this.credentialManager.hasToken() && !this.refreshingToken) {
                this.refreshingToken = true;
                this.http.post('api/login/refresh', null).subscribe((data: any) => {
                    this.credentialManager.token = data.token;
                    this.refreshingToken = false;
                }, () => {
                    this.refreshingToken = false;
                    this.logout();
                })
            }
        });
    }

    get isLoggedIn() {
        return this.credentialManager.isLoggedIn.asObservable();
    }

    login(username: string, password: string) {
        return new Promise((resolve, reject) => {
            this.http.post('api/login', {username: username, password: password}).subscribe((data: any) => {
                this.credentialManager.token = data.token;
                this.socket.emit('authenticate', data.token);
                resolve();
            }, (errorResponse: HttpErrorResponse) => {
                reject(errorResponse);
            });
        })
    }


    logout() {
        this.credentialManager.cleanToken();
    }

    checkLogin(): boolean {
        return this.credentialManager.checkLogin();
    }
}