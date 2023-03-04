import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, MaxLength } from "class-validator";

export class UpdateCategoryDto {

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
        message: "category description can't be empty"
    })
    @MaxLength(40, {
        message: "category description length can't be more 40 charater"
    })
    category_desc: string;
}