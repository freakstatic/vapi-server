import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";


@Injectable()
export class AuthService {
    private loggedIn = new BehaviorSubject<boolean>(true);

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }

    constructor(private router: Router, private http: HttpClient) {
    }

    login(username: string, password: string) {
        return new Promise((resolve, reject) => {
            this.http.post('api/login', {username: username, password: password}).subscribe(() => {
                this.loggedIn.next(true);
                resolve();
            }, (errorResponse: HttpErrorResponse) => {
                reject(errorResponse);
            });
        })
    }


    async logout() {
        this.http.get('api/logout').subscribe(() => {
            this.loggedIn.next(false);
            return true;
        }, (errorResponse: HttpErrorResponse) => {
            throw new Error(errorResponse.message);
        });
    }

    checkLogin() {
        return new Promise((resolve, reject) => {
            this.http.get('api/login/check').subscribe((response: any) => {
                this.loggedIn.next(response.isLoggedIn);
                resolve(response.isLoggedIn);
            }, (error: HttpErrorResponse) => {
                this.loggedIn.next(false);
                resolve(false);
            });
        })
    }
}