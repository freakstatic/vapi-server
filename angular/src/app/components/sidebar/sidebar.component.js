"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
exports.ROUTES = [
    { path: 'dashboard', title: 'Dashboard', icon: 'dashboard', "class": '' },
    { path: 'user-profile', title: 'User Profile', icon: 'person', "class": '' },
    { path: 'table-list', title: 'Table List', icon: 'content_paste', "class": '' },
    { path: 'typography', title: 'Typography', icon: 'library_books', "class": '' },
    { path: 'icons', title: 'Icons', icon: 'bubble_chart', "class": '' },
    { path: 'maps', title: 'Maps', icon: 'location_on', "class": '' },
    { path: 'notifications', title: 'Notifications', icon: 'notifications', "class": '' },
    { path: 'upgrade', title: 'Upgrade to PRO', icon: 'unarchive', "class": 'active-pro' },
];
var SidebarComponent = /** @class */ (function () {
    function SidebarComponent() {
    }
    SidebarComponent.prototype.ngOnInit = function () {
        this.menuItems = exports.ROUTES.filter(function (menuItem) { return menuItem; });
    };
    SidebarComponent.prototype.isMobileMenu = function () {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };
    ;
    SidebarComponent = __decorate([
        core_1.Component({
            selector: 'app-sidebar',
            templateUrl: './sidebar.component.html',
            styleUrls: ['./sidebar.component.css']
        })
    ], SidebarComponent);
    return SidebarComponent;
}());
exports.SidebarComponent = SidebarComponent;
