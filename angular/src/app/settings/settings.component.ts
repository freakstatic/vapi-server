import {Component, Input, OnInit} from '@angular/core';
import {SettingsService} from "./settings.service";
import {ConfigObject} from "../../../../src/class/ConfigObject";
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
    waitingResponse: boolean;
    
    ngOnInit() {

        this.getMotionSettings();
    }

    getMotionSettings() {
        this.settingsService.getMotionSettings().then((settings: ConfigObject[]) => {
            this.motionSettings = settings;
            this.copySettings();
        }).catch((error) => {
            console.error(error);
        });
    }

    private copySettings(){
        this.originalMotionSettings = JSON.parse(JSON.stringify(this.motionSettings)); //making a deep clone
    }

    updateMotionSettings() {

        let changes = this.motionSettings.filter((config, index) => {
            return this.originalMotionSettings[index].value != config.value;
        });

        console.log(changes);

        if (changes.length) {
            this.waitingResponse = true;
            this.settingsService.sendMotionSettings(changes).then(() => {
                this.translateService.get("SETTINGS_UPDATED").subscribe((res: string) => {
                    this.appComponent.showMessage(res);
                });
                this.copySettings();
                this.waitingResponse = false;
            }).catch((error) => {
                if (error.code){
                    this.translateService.get('ERROR-' + error.code).subscribe((res: string) => {
                        this.appComponent.showErrorMessage(res);
                    });
                }
                console.error(error);
                this.waitingResponse = false;
            })
        }else {
            this.translateService.get("SETTINGS_NOTHING_TO_UPDATE").subscribe((res: string) => {
                this.appComponent.showWarningMessage(res);
            });

        }
    }

    motionCheckboxClicked(event: any, config : ConfigObject){
        config.value = event.target.checked ? 'on' : 'off';
    }

}
