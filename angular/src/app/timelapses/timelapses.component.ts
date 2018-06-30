import {Component, OnDestroy, OnInit} from '@angular/core';
import {TimelapsesService} from "./timelapses.service";
import {Socket} from "ngx-socket-io";
import * as moment from 'moment';
import {NavbarComponent} from "../components/navbar/navbar.component";
import {TranslateService} from "@ngx-translate/core";
import {IonRangeSliderCallback} from "ng2-ion-range-slider";
import {ErrorObject} from "../../../../src/class/ErrorObject";
import {FormControl} from "@angular/forms";
import {DateAdapter} from "@angular/material";

import {environment} from '../../environments/environment';
import {CredentialsManagerService} from "../auth/credentials.manager.service";

//declare var MaterialDateTimePicker: any;

@Component({
    selector: 'app-timelapses',
    templateUrl: './timelapses.component.html',
    styleUrls: ['./timelapses.component.scss']
})
export class TimelapsesComponent implements OnInit, OnDestroy {
    param = {value: 'world'};
    private receivedCodecs = [];
    public codecsDescription = [];
    public selectedCodecDescription: string = 'libx264 H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10 (codec h264)';

    public formats = [];
    public selectedFormat: string = 'avi';
    public errorMessage: string;

    public filesProgress: string;
    public progress: string = '0%';
    public processing: boolean = false;

    startDate: Date;
    startTime: string;

    endDate: Date;
    endTime: string;

    settings = {
        bigBanner: true,
        timePicker: true,
        format: 'yyyy-MM-dd HH:mm',
        defaultOpen: false
    };
    public someRange: number[] = [3, 7];
    fps: number = 50;
    fpsSelected: number = this.fps;

    public timelapses: any[];

    public apiURL: string;

    constructor(private translateService: TranslateService,
                private timeLapsesService: TimelapsesService,
                private socket: Socket,
                private adapter: DateAdapter<any>,
                private credentialsManagerService: CredentialsManagerService) {
        this.adapter.setLocale('pt');
        this.apiURL = environment.apiURL;
    }

    selectedFrequency: string;

    public timelapseScheduleOptions;

    private picker;
    ngOnInit() {
        this.startDate = new Date();
        this.startTime = '00:00';

        this.endDate = new Date();
        this.endTime = '23:59';

        this.timeLapsesService.getCodecs().then((receivedCodecs: Array<any>) => {
            this.receivedCodecs = receivedCodecs;
            this.codecsDescription = receivedCodecs.map((codec) => {
                return codec.description;
            })
        });

        this.timeLapsesService.getFormats().then((receiveFormats: Array<any>) => {
            this.formats = receiveFormats.map((format) => {
                return format.name;
            })
        });

        this.timeLapsesService.getTimelapses().then((timelapses: any[]) => {
            this.timelapses = timelapses;
        });

        this.setSocketEvents();
        this.getTimelapseScheduleOptions();
    }

    ngOnDestroy() {
        this.socket.removeAllListeners('timelapse/progress');
        this.socket.removeAllListeners('timelapse/finish');
        this.socket.removeAllListeners('timelapse/error');
        this.socket.removeAllListeners('timelapse/files/progress');
        this.socket.removeAllListeners('timelapse/files/end');
    }

    setSocketEvents() {
        this.socket.on('timelapse/progress', (data) => {
            console.log(data);
            this.progress = data.progress + '%';
        });
        this.socket.on('timelapse/finish', (timelapse) => {
            this.progress = '100%';
            setTimeout(() => {
                this.reset();
            }, 1000);
            this.timelapses.push(timelapse);
        });

        this.socket.on('timelapse/error', (error: {}) => {
            let errorObject = new ErrorObject();
            Object.assign(errorObject, error);
            console.log(errorObject.code);
            if (errorObject.code) {
                this.translateService.get('ERROR-' + errorObject.code).subscribe((res: string) => {
                    NavbarComponent.showErrorMessage(res);
                });

            } else {
                this.translateService.get('ERROR-TIMELAPSE_UNKNOWN').subscribe((res: string) => {
                    this.errorMessage = res + '\n' + errorObject.message;
                });
            }
            this.reset();
        });

        this.socket.on('timelapse/files/progress', (data) => {
            let parameters = {
                current: data.currentIndex + 1,
                max: data.max
            };
            this.translateService.get('TIMELAPSES_FILES_PROGRESS', parameters).subscribe((res: string) => {
                this.filesProgress = res;
            });


        });

        this.socket.on('timelapse/files/end', () => {
            this.translateService.get('TIMELAPSES_RENDERING').subscribe((res: string) => {
                this.filesProgress = res;
            });

        });
    }

    getTimelapseScheduleOptions() {
        this.timeLapsesService.getTimelapseScheduleOptions().then((timelapseScheduleOptions) => {
            this.timelapseScheduleOptions = timelapseScheduleOptions;
        }).catch(() => {
            this.translateService.get('ERROR_NO_CONNECTION').subscribe((res: string) => {
                NavbarComponent.showErrorMessage(res);
            });
        })
    }

    reset() {
        this.processing = false;
        this.progress = '0%';
        this.filesProgress = '';
    }

    createTimelapse() {
        this.errorMessage = '';
        if (!this.selectedFormat.trim().length) {
            this.translateService.get('TIMELAPSES_EMPTY_FORMAT').subscribe((res: string) => {
                NavbarComponent.showWarningMessage(res);
            });
            return;
        }

        if (!this.selectedCodecDescription.trim().length) {
            this.translateService.get('TIMELAPSES_EMPTY_CODEC').subscribe((res: string) => {
                NavbarComponent.showWarningMessage(res);
            });
            return;
        }

        let selectedCodec = this.receivedCodecs.find((codec) => {
            return this.selectedCodecDescription == codec.description
        });

        if (!selectedCodec) {
            this.translateService.get('TIMELAPSES_INVALID_CODEC').subscribe((res: string) => {
                NavbarComponent.showWarningMessage(res);
            });
            return;
        }

        //   this.startDate = this.startDate instanceof Date ? this.startDate : new Date(this.startDate);
        // this.endDate = this.endDate instanceof Date ? this.endDate : new Date(this.endDate);
        let format = 'YYYY-MM-DD HH:mm';

        let splitStartTime = this.startTime.split(':');
        this.startDate.setHours(parseInt((splitStartTime[0])));
        this.startDate.setMinutes(parseInt((splitStartTime[1])));

        let splitEndTime = this.endTime.split(':');
        this.endDate.setHours(parseInt(splitEndTime[0]));
        this.endDate.setMinutes(parseInt(splitEndTime[1]));

        let momentStartDate = moment(this.startDate, '%d-%m-%Y %H:%M:%S');

        let momentEndDate = moment(this.endDate, '%d-%m-%Y %H:%M:%S');

        if (momentStartDate.valueOf() > momentEndDate.valueOf()) {
            this.translateService.get('ERROR-TIMELAPSE_START_DATE_GREATER_THAN_END_DATE').subscribe((res: string) => {
                NavbarComponent.showWarningMessage(res);
            });
            return;
        }

        this.processing = true;
        console.log('[TimelapseComponent] createTimelapse');
        this.socket.emit('timelapse/create', {
            'startDate': momentStartDate.format(format),
            'endDate': momentEndDate.format(format),
            'codec': selectedCodec.name,
            'fps': this.fpsSelected,
            'format': this.selectedFormat
        });
    }


    sliderOnUpdate($event: IonRangeSliderCallback) {
        this.fpsSelected = $event.from;
        //this.fps = $event.to();
    }

    stopTimelapse() {
        this.socket.emit('timelapse/stop');
        this.reset()
    }

    getToken(){
        return this.credentialsManagerService.getToken();
    }
}
