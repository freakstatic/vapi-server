import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {DetectionObject} from "./DetectionObject";

@Entity()
export class Detection {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @OneToMany(type => DetectionObject, detectionObject => detectionObject.detection, {
        cascade: true,
    })
    detectionObjects: DetectionObject[];

}