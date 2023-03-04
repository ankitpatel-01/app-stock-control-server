import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class PaginateDto {

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    page: number = 1;

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    limit: number;

    @IsOptional()
    search: string;
}