import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserGroup} from "./UserGroup";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    token: string;

    @OneToOne(type => UserGroup)
    @JoinColumn()
    group: UserGroup;
}


