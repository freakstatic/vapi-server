import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {Detection} from "./Detection";
import {DetectableObject} from "./DetectableObject";

@Entity()
export class DetectionObject{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    probability: number;

    @Column()
    x: number;

    @Column()
    y: number;

    @Column()
    width: number;

    @Column()
    height: number;

    @ManyToOne(type => Detection, detection => detection.detectionObjects)
    @JoinColumn()
    detection: Detection;

    @ManyToOne(type => DetectableObject)
    object: DetectableObject;

}