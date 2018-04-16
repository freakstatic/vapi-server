"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var user_profile_component_1 = require("./user-profile.component");
describe('UserProfileComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [user_profile_component_1.UserProfileComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(user_profile_component_1.UserProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
