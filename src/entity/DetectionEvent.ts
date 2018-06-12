import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Detection} from './Detection';

@Entity()
export class DetectionEvent
{
 @PrimaryGeneratedColumn()
 id: number;
 
 @Column({
  precision: 4
 })
 startDate: Date;
 
 @Column({
  precision: 4,
  nullable: true
 })
 endDate: Date;
 
 @OneToMany(type => Detection, detection => detection.event)
 detections: Detection[];
}