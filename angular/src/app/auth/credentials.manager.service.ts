import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Login} from '../objects/login';

@Injectable()
export class CredentialsManagerService {
    private tokenBecomeInvalid = new BehaviorSubject<boolean>(true);
    private loggedIn = new BehaviorSubject<boolean>(false);
    private login: Login = null;

    constructor() {
        if (!this.hasToken()) {
            return;
        }
        this.setToken(localStorage.getItem('token'), false);
        if (this.checkLogin()) {
            this.loggedIn.next(true);
        }
        else if (this.checkLogin(false)) {
            this.tokenBecomeInvalid.next(true);
        }
    }

    get isTokenBecomeInvalid() {
        return this.tokenBecomeInvalid.asObservable();
    }

    get isLoggedIn() {
        return this.loggedIn;
    }

    get getLogin(): Login {
        return this.login;
    }

    set token(token: string) {
        if (!this.setToken(token)) {
            return;
        }
        this.loggedIn.next(true);
        this.tokenBecomeInvalid.next(false);
    }

    public checkLogin(checkDate = true): boolean {
        let token = localStorage.getItem('token');
        return this.isValidToken(token, checkDate);
    }

    public hasToken(): boolean {
        let token = localStorage.getItem('token');
        return token != null && token != undefined && token.trim().length > 0;
    }

    public isValidToken(token: string, checkDate = true): boolean {
        let checkLoggedIn = token != null && token != undefined && token.trim().length > 0;
        if (!checkLoggedIn) {
            return false;
        }

        let login = new Login(token);
        checkLoggedIn = login.isValid(checkDate);
        return checkLoggedIn;
    }

    public cleanToken() {
        localStorage.removeItem('token');
        this.isLoggedIn.next(false);
        this.login = null;
        this.tokenBecomeInvalid.next(false);
    }

    private setToken(token: string, checkDate = true): boolean {
        let login = new Login(token);
        let valid = login.isValid(checkDate);
        if (!valid) {
            return false;
        }
        this.login = login;
        localStorage.setItem('token', token);
        return true;
    }

    public getToken(){
        return localStorage.getItem('token');
    }

}