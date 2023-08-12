import { IsNotEmpty, IsNumber, IsOptional, MaxLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({
        message: "name can't be empty"
    })
    @MaxLength(30, {
        message: "name length can't be more 30 charater"
    })
    name: string;

    @IsOptional()
    @MaxLength(60, {
        message: "name length can't be more 60 charater"
    })
    full_name: string;

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

export class SignUpUserDto {
    @IsNotEmpty({
        message: "first name can't be empty"
    })
    @MaxLength(50, {
        message: "first name length can't be more 50 charater"
    })
    first_name: string;

    @IsOptional()
    @MaxLength(50, {
        message: "middle name length can't be more 50 charater"
    })
    middle_name: string;

    @IsNotEmpty({
        message: "last name can't be empty"
    })
    @MaxLength(50, {
        message: "last name length can't be more 50 charater"
    })
    last_name: string;

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

    @IsNotEmpty()
    @IsNumber()
    companyId: number;
}
