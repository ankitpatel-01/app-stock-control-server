import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, MaxLength } from "class-validator";

export class UpdateQualityDto {

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
    quality_desc: string;

    @IsNotEmpty({
        message: "type can't be empty"
    })
    type: number;
}