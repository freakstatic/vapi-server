import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class TimelapseScheduleOption {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;

    @Column()
    cronFormat: string;
}