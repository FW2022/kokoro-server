import { IsArray, IsString } from "class-validator";

export class CreateBoardDto {
    @IsString()
    content: string;

    @IsArray()
    image: string[];
}
