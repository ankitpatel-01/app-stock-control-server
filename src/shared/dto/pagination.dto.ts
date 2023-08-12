import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class PaginateDto {

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    page: number = 1;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    limit: number;

    @ApiPropertyOptional()
    @IsOptional()
    search: string;
}