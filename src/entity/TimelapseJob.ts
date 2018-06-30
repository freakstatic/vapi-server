import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {TimelapseScheduleOption} from "./TimelapseScheduleOption";

@Entity()
export class TimelapseJob {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => TimelapseScheduleOption)
    scheduleOption;


}