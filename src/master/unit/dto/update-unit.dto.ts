import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, MaxLength } from "class-validator";

export class UpdateUnitDto {

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
        message: "unit description can't be empty"
    })
    @MaxLength(30, {
        message: "unit description length can't be more 30 charater"
    })
    unit_desc: string;

    @IsNotEmpty({
        message: "unit code can't be empty"
    })
    @MaxLength(10, {
        message: "unit code length can't be more 10 charater"
    })
    unit_name: string;
}