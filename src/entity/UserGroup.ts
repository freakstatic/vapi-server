import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class UserGroup {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;


}