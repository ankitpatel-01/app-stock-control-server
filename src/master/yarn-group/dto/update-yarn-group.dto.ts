import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, MaxLength } from "class-validator";

export class UpdateYarnGroupDto {

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
        message: "yarn group description can't be empty"
    })
    @MaxLength(30, {
        message: "yarn group description length can't be more 30 charater"
    })
    yarn_grp_name: string;
}