import {Component, Input, OnInit} from '@angular/core';
import {SettingsService} from "./settings.service";
import {ConfigObject} from "../../../../src/class/config-object";
import {AppComponent} from "../app.component";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    constructor(private translateService: TranslateService, private appComponent: AppComponent, private settingsService: SettingsService) {
    }

    @Input()
    motionSettings: ConfigObject[];
    private originalMotionSettings: ConfigObject[];

    ngOnInit() {

        this.getMotionSettings();
    }

    getMotionSettings() {
        this.settingsService.getMotionSettings().then((settings: ConfigObject[]) => {
            this.motionSettings = settings;
            this.originalMotionSettings = JSON.parse(JSON.stringify(settings)); //making a deep clone
        }).catch((error) => {

        });
    }

    updateMotionSettings() {

        let changes = this.motionSettings.filter((config, index) => {
            return this.originalMotionSettings[index].value != config.value;
        });

        console.log(changes);

        if (changes.length) {
            this.settingsService.sendMotionSettings(changes).then(() => {
                this.translateService.get("SETTINGS_UPDATED").subscribe((res: string) => {
                    this.appComponent.showMessage(res);
                });


            }).catch((error) => {
                console.error(error);
            })
        }else {
            this.translateService.get("SETTINGS_NOTHING_TO_UPDATE").subscribe((res: string) => {
                this.appComponent.showWarningMessage(res);
            });

        }

    }

}
