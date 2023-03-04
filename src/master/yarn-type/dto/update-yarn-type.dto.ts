import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, MaxLength } from "class-validator";

export class UpdateYarnTypeDto {

    @IsNotEmpty({
        message: "id can't be empty"
    })
    @IsNumber({
        allowNaN: false,
    }, {
        message: 'id should be numeric value'
    })
    @Transform(({ value }) => parseInt(value))
    id: number;

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