import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {UserGroup} from './UserGroup';
import {Timelapse} from './Timelapse';

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

    @ManyToOne(type => UserGroup)
    @JoinColumn()
    group: UserGroup;

    @OneToMany(type => Timelapse, timelapse => timelapse.user)
    timelapses: Timelapse[];
}


