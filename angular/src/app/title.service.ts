import { Injectable } from '@angular/core';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

const APP_TITLE = 'VAPI';
const SEPARATOR = ' > ';

@Injectable()
export class TitleService {
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title,
    ) {}

    init() {
        this.router.events
            .filter((event) => event instanceof NavigationEnd)
            .map(() => {
                let route = this.activatedRoute;
                while (route.firstChild) route = route.firstChild;
                return route;
            })
            .filter((route) => route.outlet === 'primary')
            .mergeMap((route) => route.data)
            .map((data) => {
                if ( data.title ) {
                    // If a route has a title set (e.g. data: {title: "Foo"}) then we use it
                    return data.title;
                } else {
                    // If not, we do a little magic on the url to create an approximation
                    return this.router.url.split('/').reduce((acc, frag) => {
                        if ( acc && frag ) { acc += SEPARATOR; }
                        return acc + TitleService.ucFirst(frag);
                    });
                }
            })
            .subscribe((pathString) => this.titleService.setTitle(`${APP_TITLE} ${pathString}`));
    }

    static ucFirst(string) {
        if ( !string ) { return string; }
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}