import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {reject} from "q";


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
                let json = JSON.parse(errorResponse.error);
                reject(json);
            });
        })
    }


    logout() {
        this.loggedIn.next(false);
        this.router.navigate(['/login']);
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