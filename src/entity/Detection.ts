import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {DetectionObject} from "./DetectionObject";

@Entity()
export class Detection {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        precision: 4
    })
    date: Date;

    @OneToMany(type => DetectionObject, detectionObject => detectionObject.detection, {
        cascade: ['insert']
    })
    detectionObjects: Promise<DetectionObject[]>;

    @Column()
    numberOfDetections: number;

    @Column()
    imgUrl: string;
}