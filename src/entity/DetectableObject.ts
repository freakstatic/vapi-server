import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {DetectionObject} from "./DetectionObject";

@Entity()
export class DetectableObject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}