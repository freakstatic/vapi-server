import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Detection} from './Detection';

@Entity()
export class DetectionImage
{
 @PrimaryGeneratedColumn()
 id: number;
 
 @OneToOne(type => Detection)
 detection: Detection;
 
 @Column()
 path: string;
 
 @Column({
  precision: 4
 })
 dateCreated: Date;
}