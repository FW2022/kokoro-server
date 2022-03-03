import { Module } from "@nestjs/common";
import { MessengerService } from "./messenger.service";
import { MessengerController } from "./messenger.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Messenger } from "./entities/messenger.entity";
import { MessengerUser } from "./entities/messengerUser.entity";
import { MessengerText } from "./entities/messengerText.entity";
import { User } from "../user/entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Messenger,
            MessengerUser,
            MessengerText,
            User,
        ]),
    ],
    controllers: [MessengerController],
    providers: [MessengerService],
    exports: [MessengerService],
})
export class MessengerModule {}
