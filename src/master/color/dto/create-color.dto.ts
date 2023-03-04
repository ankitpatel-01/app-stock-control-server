import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateColorDto {

    @IsNotEmpty({
        message: "color description can't be empty"
    })
    @MaxLength(30, {
        message: "color description length can't be more 30 charater"
    })
    color_desc: string;

    @IsNotEmpty({
        message: "color code can't be empty"
    })
    @MaxLength(3, {
        message: "color code length can't be more 3 charater"
    })
    color_code: string;
}