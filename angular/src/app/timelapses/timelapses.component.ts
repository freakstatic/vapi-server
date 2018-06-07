import {Component, OnInit} from '@angular/core';
import {TimelapsesService} from "./timelapses.service";
import {Socket} from "ngx-socket-io";
import * as moment from 'moment';
import {NavbarComponent} from "../components/navbar/navbar.component";
import {TranslateService} from "@ngx-translate/core";
import {IonRangeSliderCallback} from "ng2-ion-range-slider";


@Component({
    selector: 'app-timelapses',
    templateUrl: './timelapses.component.html',
    styleUrls: ['./timelapses.component.scss']
})
export class TimelapsesComponent implements OnInit {

    private receivedCodecs = [];
    public codecsDescription = [];
    public selectedCodecDescription: string = '';

    public formats = [];
    public selectedFormat: string = '';
    public errorMessage: string;

    public progress: string = '0%';
    public processing: boolean = false;

    startDate: Date;
    endDate: Date;
    settings = {
        bigBanner: true,
        timePicker: true,
        format: 'yyyy-MM-dd HH:mm',
        defaultOpen: false
    };
    public someRange: number[] = [3, 7];
    fps: number = 50;

    constructor(private translateService: TranslateService,
                private timeLapsesService: TimelapsesService, private socket: Socket) {
    }


    ngOnInit() {
        this.startDate = new Date();
        this.endDate = new Date();
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

        this.setSocketEvents();
    }

    setSocketEvents() {
        this.socket.on('timelapse/progress', (data) => {
            console.log(data);
            this.progress = data.progress + '%';
        });
        this.socket.on('timelapse/finish', (data) => {
            this.progress = '100%';
            setTimeout(() => {
                this.reset();
            }, 1000);
        });

        this.socket.on('timelapse/error', (error) => {
            this.translateService.get('ERROR-TIMELAPSE_UNKNOWN').subscribe((res: string) => {
                this.errorMessage = res + '\n' + error;
            });
            this.reset();
        })
    }

    reset() {
        this.processing = false;
        this.progress = '0%';
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

        this.startDate = this.startDate instanceof Date ? this.startDate : new Date(this.startDate);
        this.endDate = this.endDate instanceof Date ? this.endDate : new Date(this.endDate);
        let format = 'YYYY-MM-DD HH:mm';
        let momentStartDate = moment(this.startDate, '%Y-%m-%d %H:%M:%S');
        let momentEndDate = moment(this.endDate, '%Y-%m-%d %H:%M:%S');

        if (momentStartDate.valueOf() > momentEndDate.valueOf()) {
            this.translateService.get('ERROR-TIMELAPSE_START_DATE_GREATER_THAN_END_DATE').subscribe((res: string) => {
                NavbarComponent.showWarningMessage(res);
            });
            return;
        }

        this.processing = true;
        this.socket.emit('timelapse/create', {
            'startDate': momentStartDate.format(format),
            'endDate': momentEndDate.format(format),
            'codec': selectedCodec.name,
            'fps': this.fps,
            'format': this.selectedFormat
        });
    }


    sliderOnChange($event: IonRangeSliderCallback) {
       this.fps = $event.from;
        //this.fps = $event.to();
    }
}