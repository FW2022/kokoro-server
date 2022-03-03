import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Messenger } from "./messenger.entity";

@Entity()
export class MessengerUser {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @Column()
    userID: string;

    @Column()
    unreadCount?: number = 0;

    @Column({ nullable: true })
    lastReadText?: string;

    @Column()
    lastReadTime?: Date = new Date();

    @ManyToOne((type) => Messenger, (messenger) => messenger.user, {
        cascade: true,
        onDelete: "CASCADE",
    })
    messenger: Messenger;

    constructor(args: MessengerUser) {
        if (args) {
            Object.keys(args).forEach((key) => {
                this[key] = args[key];
            });
        }
    }
}
