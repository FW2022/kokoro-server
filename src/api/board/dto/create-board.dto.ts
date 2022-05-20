import { IsString } from "class-validator";

export class CreateBoardDto {
    @IsString()
    author: string;
}
