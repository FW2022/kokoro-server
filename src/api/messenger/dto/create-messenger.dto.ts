import { IsString } from "class-validator";

export class CreateMessengerDto {
    @IsString()
    targetUserID: string;
}
