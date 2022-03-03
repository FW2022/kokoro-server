import {
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../user/entities/user.entity";
import { MessengerText } from "./messengerText.entity";
import { MessengerUser } from "./messengerUser.entity";

@Entity()
export class Messenger {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @OneToMany((type) => MessengerUser, (user) => user.messenger)
    user?: MessengerUser[];

    @OneToMany((type) => MessengerText, (message) => message.messenger)
    message?: MessengerText[];

    constructor(args?: Messenger) {
        if (args) {
            Object.keys(args).forEach((key) => {
                this[key] = args[key];
            });
        }
    }
}
