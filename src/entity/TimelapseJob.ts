import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {TimelapseScheduleOption} from "./TimelapseScheduleOption";

@Entity()
export class TimelapseJob {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => TimelapseScheduleOption)
    @JoinColumn()
    scheduleOption: TimelapseScheduleOption;

    @Column()
    format: string;

    @Column()
    codec: string;

    @Column()
    fps: number;
}