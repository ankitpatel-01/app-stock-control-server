import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateYarnTypeDto {
    @IsNotEmpty({
        message: "description can't be empty"
    })
    @MaxLength(40, {
        message: "description length can't be more 40 charater"
    })
    type_desc: string;

    @IsNotEmpty({
        message: "type can't be empty"
    })
    @MaxLength(40, {
        message: "type length can't be more 1 charater"
    })
    type: string;

    @IsNotEmpty({
        message: "count type can't be empty"
    })
    @MaxLength(40, {
        message: "count type length can't be more 1 charater"
    })
    count_type: string;
}