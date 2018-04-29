import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Detection} from "./Detection";
import {DetectableObject} from "./DetectableObject";

@Entity()
export class DetectionObject{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    score: number;

    @Column()
    x: number;

    @Column()
    y: number;

    @Column()
    width: number;

    @Column()
    height: number;

    @OneToOne(type => Detection, detection => detection.detectionObjects)
    detection: Detection;

    @ManyToOne(type => DetectableObject)
    object: DetectableObject;
}