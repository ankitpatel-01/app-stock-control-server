import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateQualityDto {

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