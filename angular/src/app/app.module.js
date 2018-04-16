"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var app_routing_1 = require("./app.routing");
var components_module_1 = require("./components/components.module");
var app_component_1 = require("./app.component");
var dashboard_component_1 = require("./dashboard/dashboard.component");
var user_profile_component_1 = require("./user-profile/user-profile.component");
var table_list_component_1 = require("./table-list/table-list.component");
var typography_component_1 = require("./typography/typography.component");
var icons_component_1 = require("./icons/icons.component");
var maps_component_1 = require("./maps/maps.component");
var notifications_component_1 = require("./notifications/notifications.component");
var upgrade_component_1 = require("./upgrade/upgrade.component");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                dashboard_component_1.DashboardComponent,
                user_profile_component_1.UserProfileComponent,
                table_list_component_1.TableListComponent,
                typography_component_1.TypographyComponent,
                icons_component_1.IconsComponent,
                maps_component_1.MapsComponent,
                notifications_component_1.NotificationsComponent,
                upgrade_component_1.UpgradeComponent,
            ],
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                components_module_1.ComponentsModule,
                router_1.RouterModule,
                app_routing_1.AppRoutingModule
            ],
            providers: [],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
