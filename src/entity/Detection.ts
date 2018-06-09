import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {DetectionObject} from "./DetectionObject";
import {DetectionImage} from "./DetectionImage";
import {DetectionEvent} from "./DetectionEvent";

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

    @OneToOne(type => DetectionImage, {
        cascade: ['insert']
    })
    @JoinColumn()
    image: DetectionImage;

    @ManyToOne(type => DetectionEvent, detectionEvent => detectionEvent.detections)
    @JoinColumn()
    event: DetectionEvent;
}