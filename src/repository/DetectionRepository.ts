import {Between, EntityRepository, getConnection, LessThan, MoreThan, Repository} from "typeorm";
import {Detection} from "../entity/Detection";


@EntityRepository(Detection)
export class DetectionRepository extends Repository<Detection> {


    public async get(startDate: Date, endDate: Date): Promise<Detection[]> {
        let options = this.populateOptionDate(startDate, endDate);
        return await this.find(options);
    }

    public async getStats(startDate: Date, endDate: Date): Promise<Object> {
        let result = await this.get(startDate, endDate);
        return new Promise<Object>((resolve) => {
            let obj = {};
            const dateOptions = {year: 'numeric', month: '2-digit', day: '2-digit'};

            for (let i = 0; i < result.length; ++i) {
                let date = new Date(result[i].date).toLocaleDateString('pt-PT', dateOptions);
                if (obj[date] == null || obj[date] == undefined) {
                    obj[date] = 0;
                }
                obj[date] += result[i].numberOfDetections;
            }

            let dates = this.populateTheDates({startDate, endDate}, obj);
            startDate = dates.startDate;
            endDate = dates.endDate;
            let date = new Date();
            let currentDate = new Date();
            date.setTime(startDate.getTime());
            let response = {};

            while (date.getTime() <= endDate.getTime() && date.getTime() <= currentDate.getTime()) {
                let dateString = date.toLocaleDateString('pt-PT', dateOptions);
                if (obj[dateString] == null || obj[dateString] == undefined) {
                    response[dateString] = 0;
                }
                else {
                    response[dateString] = obj[dateString];
                }
                date.setDate(date.getDate() + 1);
            }
            resolve(response);
        });
    }

    private populateOptionDate(startDate: Date, endDate: Date): Object {
        let options = {};
        let hasStartDate = startDate !== undefined && startDate !== null;
        let hasEndDate = endDate !== undefined && endDate !== null;

        if (hasStartDate && hasEndDate) {
            options['date'] = Between(startDate, endDate);
        }
        else if (hasStartDate) {
            options['date'] = MoreThan(startDate);
        }
        else if (hasEndDate) {
            options['date'] = LessThan(endDate);
        }

        options['relations'] = ['image'];
        return options;
    }

    private populateTheDates(dates: { startDate: Date, endDate: Date }, responseObject: any): any {
        let hasNotStartDate = dates.startDate == undefined && dates.startDate == null;
        let hasNotEndDate = dates.endDate == undefined && dates.endDate == null;

        if (hasNotStartDate && hasNotEndDate) {
            dates.startDate = new Date();
            dates.endDate = new Date();
            dates.endDate.setTime(0);

            for (let dateString in responseObject) {
                let date = new Date(dateString);
                if (date.getTime() < dates.startDate.getTime()) {
                    dates.startDate = new Date();
                    dates.startDate.setTime(date.getTime());
                }
                if (date.getTime() > dates.endDate.getTime()) {
                    dates.endDate = new Date();
                    dates.endDate.setTime(date.getTime());
                }
            }
        }
        else if (hasNotStartDate) {
            dates.startDate = new Date();
            dates.startDate.setTime(dates.endDate.getTime());
            dates.startDate.setDate(dates.startDate.getDate() - 6);
        }
        else if (hasNotEndDate) {
            dates.endDate = new Date();
            let daysDiff = (dates.endDate.getTime() - dates.startDate.getTime()) / 86400000;
            dates.endDate.setTime(dates.startDate.getTime());
            if (daysDiff > 6) {
                daysDiff = 6;
            }
            daysDiff = Math.floor(daysDiff);
            dates.endDate.setDate(dates.endDate.getDate() + daysDiff);
        }
        return dates;
    }


}