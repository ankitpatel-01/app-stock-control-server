import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateLocationDto {

    @IsNotEmpty({
        message: "location name can't be empty"
    })
    @MaxLength(50, {
        message: "location name length can't be more 50 charater"
    })
    location_name: string;

    @IsNotEmpty({
        message: "factory name can't be empty"
    })
    @MaxLength(50, {
        message: "factory name length can't be more 50 charater"
    })
    factory_name: string;

    @IsNotEmpty({
        message: "factory city can't be empty"
    })
    @MaxLength(50, {
        message: "factory city length can't be more 50 charater"
    })
    factory_city: string;
}