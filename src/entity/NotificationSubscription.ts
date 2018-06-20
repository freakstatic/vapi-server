import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {DetectableObject} from "./DetectableObject";

@Entity()
export class NotificationSubscription {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    endpoint: string;

    @Column()
    auth: string;

    @Column()
    p256dh: string;

    @ManyToMany(type => DetectableObject)
    @JoinTable({
        name: 'notification_subscription_detectable_object'
    })
    detectableObjects: DetectableObject[];

    @Column()
    language: string
}