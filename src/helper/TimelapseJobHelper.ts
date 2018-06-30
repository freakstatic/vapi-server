import {Timelapse} from "../entity/Timelapse";
import {getConnection} from "typeorm";
import {TimelapseJob} from "../entity/TimelapseJob";
import {TimelapseScheduleOption} from "../entity/TimelapseScheduleOption";
import {TimelapseHelper} from "./TimelapseHelper";
import {DetectionRepository} from "../repository/DetectionRepository";

const schedule = require('node-schedule');
const subDays = require('date-fns/sub_days');
const startOfDay = require('date-fns/start_of_day');
const endOfDay = require('date-fns/end_of_day');
const subWeeks = require('date-fns/sub_weeks');
const startOfWeek = require('date-fns/start_of_week');
const endOfWeek = require('date-fns/end_of_week');
const subMonths = require('date-fns/sub_months');
const startOfMonth = require('date-fns/start_of_month');
const endOfMonth = require('date-fns/end_of_month');

export class TimelapseJobHelper {

    private scheduleJobs: any[];
    private timelapseHelper: TimelapseHelper;

    constructor() {
        this.scheduleJobs = [];
    }

    async deleteAllJobs() {
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(TimelapseJob)
            .execute();

        this.scheduleJobs.forEach((job) => {
            job.cancel();
        });

        this.scheduleJobs = [];
    }

    async handleNewJobs(timelapseJobsReceived: any[]) {
        await this.deleteAllJobs();
        let promises = [];
        for (let timelapseJobReceived of timelapseJobsReceived) {

            let scheduleOption = await getConnection()
                .getRepository(TimelapseScheduleOption).findOne(timelapseJobReceived.scheduleOption.id);
            let timelapseJob = new TimelapseJob();
            timelapseJob.scheduleOption = scheduleOption;
            timelapseJob.codec = timelapseJobReceived.codec;
            timelapseJob.format = timelapseJobReceived.format;
            timelapseJob.fps = timelapseJobReceived.fps;
            promises.push(getConnection().getRepository(TimelapseJob).insert(timelapseJob));
        }
        await Promise.all(promises);
        await this.loadJobs();
    }

    async loadJobs() {
        let jobs = await this.getJobs();
        for (let job of jobs) {
            this.scheduleJobs.push(
                schedule.scheduleJob(job.scheduleOption.cronFormat, async () => {
                    let startDate, endDate;
                    let currentDate = new Date();
                    switch (job.scheduleOption.name) {

                        case 'DAILY':
                            let yesterday = subDays(currentDate, 1);
                            startDate = startOfDay(yesterday);
                            endDate = endOfDay(yesterday);
                            break;

                        case 'WEEKLY':
                            let previousWeek = subWeeks(currentDate, 1);
                            startDate = startOfWeek(previousWeek);
                            endDate = endOfWeek(previousWeek);
                            break;

                        case 'MONTHLY':
                            let previousMonth = subMonths(currentDate, 1);
                            startDate = startOfMonth(previousMonth);
                            endDate = endOfMonth(previousMonth);
                            break;
                    }

                    let detections = await getConnection().getCustomRepository(DetectionRepository).getByDatesWithRelations(startDate, endDate);
                    if (detections != null && detections.length != 0) {
                        TimelapseHelper.create(detections, job.codec, job.format, job.fps, null, null);
                    }
                })
            );
        }
    }


    async getJobs(): Promise<TimelapseJob[]> {
        return await getConnection().getRepository(TimelapseJob).find({relations: ["scheduleOption"]});
    }
}