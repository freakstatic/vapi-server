"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var upgrade_component_1 = require("./upgrade.component");
describe('UpgradeComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [upgrade_component_1.UpgradeComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(upgrade_component_1.UpgradeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
