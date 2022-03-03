import { IsOptional, IsString, IsUUID } from "class-validator";
import { User } from "../../user/entities/user.entity";
import { Messenger } from "../entities/messenger.entity";

export class FindMessengerListDto {
    @IsOptional()
    @IsString()
    targetUserID?: string;
}

export class FindMessageDto {
    @IsUUID()
    messengerID: string;
}

export class FindMessageRes {
    messenger: Messenger;

    targetUserInfo: User;
}

export class SendMessageDto {
    @IsString()
    text: string;

    @IsUUID()
    messengerID: string;
}

export class FollowDto {
    @IsString()
    targetUserID: string;
}
