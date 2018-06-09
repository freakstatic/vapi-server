import {Location} from '@angular/common';
import {Component, ElementRef, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Socket} from 'ngx-socket-io';
import {ErrorObject} from "../../../../../src/class/ErrorObject";
import {AuthService} from "../../auth/auth.service";
import {ROUTES} from '../sidebar/sidebar.component';

declare const $: any;

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    private toggleButton: any;
    private sidebarVisible: boolean;

    constructor(location: Location, private element: ElementRef,
                private authService: AuthService, private router: Router,
                private socket: Socket,
                private translateService: TranslateService,
    ) {
        this.location = location;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];

        this.socket.on('error', (errorObject: ErrorObject) => {
            this.handleSocketError(this.socket, errorObject);
        })
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };

    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };

    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(2);
        }
        titlee = titlee.split('/').pop();

        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === titlee) {
                return this.listTitles[item].title;
            }
        }
        return 'Dashboard';
    }

     logout() {
        this.authService.logout();
    }

    static showErrorMessage(message: string) {
        $.notify({
            icon: 'material-icons',
            message: message
        }, {
            type: 'danger',
            timer: 2000,
        });
    }

    static showWarningMessage(message: string) {
        $.notify({
            icon: 'material-icons',
            message: message
        }, {
            type: 'warning',
            timer: 2000,
        });
    }

    static showMessage(message: string) {
        $.notify({
            icon: 'material-icons',
            message: message
        }, {
            type: 'success',
            timer: 2000,
        });
    }

    handleSocketError(socket: Socket, errorObject: ErrorObject) {
        this.translateService.get('ERROR-' + errorObject.code).subscribe((res: string) => {
            NavbarComponent.showErrorMessage(res);
        });
    }
}
