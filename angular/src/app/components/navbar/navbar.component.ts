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
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;

    private language: string;

    constructor(location: Location, private element: ElementRef,
                private authService: AuthService,
                private router: Router,
                // private socket: Socket,
                private translateService: TranslateService
    ) {
        this.location = location;
        this.sidebarVisible = false;
        this.language = localStorage.getItem('language');
    }

    ngOnInit() {
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.router.events.subscribe((event) => {
            this.sidebarClose();
            var $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
                this.mobile_menu_visible = 0;
            }
        });

        console.log(this.language);
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function(){
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
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function() {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function() {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            }else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function() {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function() { //asign a function
                body.classList.remove('nav-open');
                this.mobile_menu_visible = 0;
                $layer.classList.remove('visible');
                setTimeout(function() {
                    $layer.remove();
                    $toggle.classList.remove('toggled');
                }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle(){
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if(titlee.charAt(0) === '#'){
            titlee = titlee.slice( 2 );
        }
        titlee = titlee.split('/').pop();

        for(var item = 0; item < this.listTitles.length; item++){
            if(this.listTitles[item].path === titlee){
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

    changeLanguage(newLanguage){
        this.language = newLanguage;
        this.translateService.use(newLanguage);
        localStorage.setItem('language', newLanguage);
        window.location.reload();
    }

    handleSocketError(socket: Socket, errorObject: ErrorObject) {
        // this.translateService.get('ERROR-' + errorObject.code).subscribe((res: string) => {
        //     NavbarComponent.showErrorMessage(res);
        // });
    }
}
