import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { environment } from '../../environments/environment';
import {ConfigObject} from "../../../../src/class/config-object";

@Injectable()
export class SettingsService {

    constructor(private http: HttpClient) {

    }

    getMotionSettings(){
        return new Promise((resolve, reject) => {
            this.http.get(environment.apiEndpoint + 'motion/settings').subscribe((settings : ConfigObject[]) => {
                resolve(settings);
            }, (errorResponse: HttpErrorResponse) => {
                let json = JSON.parse(errorResponse.error);
                reject(json);
            });
        });
    }

    sendMotionSettings(settings: ConfigObject[]){
        return new Promise((resolve, reject) => {
            this.http.post(environment.apiEndpoint + 'motion/settings/update', settings).subscribe(() => {
                resolve();
            }, (errorResponse: HttpErrorResponse) => {
                let json = JSON.parse(errorResponse.error);
                reject(json);
            });
        })
    }
}
