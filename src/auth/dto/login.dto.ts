import { IsNotEmpty, MaxLength } from "class-validator";

export class LoginDto {
    @IsNotEmpty({
        message: "username can't be empty"
    })
    @MaxLength(50, {
        message: "username length can't be more 50 charater"
    })
    username: string;

    @IsNotEmpty({
        message: "password can't be empty"
    })
    @MaxLength(8, {
        message: "password length can't be more 8 charater"
    })
    password: string;
}