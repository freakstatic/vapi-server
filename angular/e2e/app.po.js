"use strict";
exports.__esModule = true;
var protractor_1 = require("protractor");
var MaterialDashboardAngularPage = /** @class */ (function () {
    function MaterialDashboardAngularPage() {
    }
    MaterialDashboardAngularPage.prototype.navigateTo = function () {
        return protractor_1.browser.get('/');
    };
    MaterialDashboardAngularPage.prototype.getParagraphText = function () {
        return protractor_1.element(protractor_1.by.css('app-root h1')).getText();
    };
    return MaterialDashboardAngularPage;
}());
exports.MaterialDashboardAngularPage = MaterialDashboardAngularPage;
