import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Messenger } from "./messenger.entity";

@Entity()
export class MessengerText {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @Column()
    userID: string;

    @Column()
    text: string;

    @ManyToOne((type) => Messenger, (messenger) => messenger.message, {
        cascade: true,
        onDelete: "CASCADE",
    })
    @JoinColumn()
    messenger: Messenger;

    constructor(args: MessengerText) {
        if (args) {
            Object.keys(args).forEach((key) => {
                this[key] = args[key];
            });
        }
    }
}
