import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Detection} from "./Detection";
import {User} from "./User";


@Entity()
export class Timelapse {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(type => Detection)
    @JoinTable()
    detections: Detection[];

    @Column()
    codec: string;

    @Column()
    filename: string;

    @Column({
        precision: 4
    })
    dateCreated: Date;

    @ManyToOne(type => User, user => user.timelapses)
    user: User;

}