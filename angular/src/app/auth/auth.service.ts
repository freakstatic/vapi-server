import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {reject} from "q";


@Injectable()
export class AuthService {
    private loggedIn = new BehaviorSubject<boolean>(false);

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }

    constructor(private router: Router, private http: HttpClient) {}

    login(username) {
        this.loggedIn.next(true);
        this.router.navigate(['/']);
    }

    logout() {
        this.loggedIn.next(false);
        this.router.navigate(['/login']);
    }

    checkLogin() {
        return new Promise((resolve, reject) => {
            this.http.get('api/login/check').subscribe((response : any) => {
                this.loggedIn.next(response.isLoggedIn);
                resolve(response.isLoggedIn);
            }, (error: HttpErrorResponse) => {
                this.loggedIn.next(false);
                resolve(false);
            });
        })
    }
}