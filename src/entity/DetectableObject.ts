import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class DetectableObject
{
 @PrimaryGeneratedColumn()
 id: number;
 
 @Column()
 name: string;
}