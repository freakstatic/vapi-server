"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var typography_component_1 = require("./typography.component");
describe('TypographyComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [typography_component_1.TypographyComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(typography_component_1.TypographyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
