import {Location, PopStateEvent} from '@angular/common';
import {Component, OnInit, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {TranslateService} from "@ngx-translate/core";
import PerfectScrollbar from 'perfect-scrollbar';
import 'rxjs/add/operator/filter';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from "./auth/auth.service";
import {NavbarComponent} from './components/navbar/navbar.component';
import {TitleService} from "./title.service";
import {Socket} from "socket.io";
import {ErrorObject} from "../../../src/class/ErrorObject";

declare const $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    private _router: Subscription;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];

    showNav: boolean = false;
    isLoggedIn: boolean;
    private mainPanelStyle;

    @ViewChild(NavbarComponent) navbar: NavbarComponent;

    constructor(public location: Location,
                private router: Router,
                private authService: AuthService,
                translate: TranslateService, http: Http,
                private titleService: TitleService) {


        translate.setDefaultLang('en');
        //translate.use('pt');
    }

    ngOnInit() {
        $.material.init();
        this.titleService.init();
        const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
        const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');

        this.location.subscribe((ev: PopStateEvent) => {
            this.lastPoppedUrl = ev.url;
        });
        this.router.events.subscribe((event: any) => {
            this.navbar.sidebarClose();
            if (event instanceof NavigationStart) {
                if (event.url != this.lastPoppedUrl)
                    this.yScrollStack.push(window.scrollY);
            } else if (event instanceof NavigationEnd) {
                if (event.url == this.lastPoppedUrl) {
                    this.lastPoppedUrl = undefined;
                    window.scrollTo(0, this.yScrollStack.pop());
                } else
                    window.scrollTo(0, 0);
            }
        });

        this.authService.isLoggedIn.subscribe((isLoggedIn) => {
            this.isLoggedIn = isLoggedIn;
            if (this.isLoggedIn) {
                if (elemMainPanel && elemSidebar){
                    this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
                        elemMainPanel.scrollTop = 0;
                        elemSidebar.scrollTop = 0;
                    });
                    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
                        let ps = new PerfectScrollbar(elemMainPanel);
                        ps = new PerfectScrollbar(elemSidebar);
                    }
                }
                this.mainPanelStyle = '';
            } else {
                this.mainPanelStyle = '100%';
            }
        });
    }

    ngAfterViewInit() {
        this.runOnRouteChange();
    }

    isMaps(path) {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        titlee = titlee.slice(1);
        if (path == titlee) {
            return false;
        }
        else {
            return true;
        }
    }

    runOnRouteChange(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
            const ps = new PerfectScrollbar(elemMainPanel);
            ps.update();
        }
    }

    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }




}
