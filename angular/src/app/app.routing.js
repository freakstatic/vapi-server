"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var platform_browser_1 = require("@angular/platform-browser");
var router_1 = require("@angular/router");
var dashboard_component_1 = require("./dashboard/dashboard.component");
var user_profile_component_1 = require("./user-profile/user-profile.component");
var table_list_component_1 = require("./table-list/table-list.component");
var typography_component_1 = require("./typography/typography.component");
var icons_component_1 = require("./icons/icons.component");
var maps_component_1 = require("./maps/maps.component");
var notifications_component_1 = require("./notifications/notifications.component");
var upgrade_component_1 = require("./upgrade/upgrade.component");
var routes = [
    { path: 'dashboard', component: dashboard_component_1.DashboardComponent },
    { path: 'user-profile', component: user_profile_component_1.UserProfileComponent },
    { path: 'table-list', component: table_list_component_1.TableListComponent },
    { path: 'typography', component: typography_component_1.TypographyComponent },
    { path: 'icons', component: icons_component_1.IconsComponent },
    { path: 'maps', component: maps_component_1.MapsComponent },
    { path: 'notifications', component: notifications_component_1.NotificationsComponent },
    { path: 'upgrade', component: upgrade_component_1.UpgradeComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                platform_browser_1.BrowserModule,
                router_1.RouterModule.forRoot(routes)
            ],
            exports: []
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
