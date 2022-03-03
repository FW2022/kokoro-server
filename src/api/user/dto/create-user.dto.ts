import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    id: string;

    @IsString()
    password: string;

    @IsEmail()
    email: string;

    @IsString()
    name: string;
}
