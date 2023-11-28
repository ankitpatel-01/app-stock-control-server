import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';
import { YarnGryDyeEnum } from 'src/master/entities/yarn.entity';

export class UpdateYarnDto {
  @IsNotEmpty({
    message: "id can't be empty",
  })
  @IsNumber(
    {
      allowNaN: false,
    },
    {
      message: 'id should be numeric value',
    },
  )
  id: number;

  @IsNotEmpty({
    message: "yarn code can't be empty",
  })
  @MaxLength(13, {
    message: "yarn code length can't be more 13 charater",
  })
  yarn_code: string;

  @IsNotEmpty({
    message: "yarn description can't be empty",
  })
  @MaxLength(60, {
    message: "yarn description length can't be more 60 charater",
  })
  yarn_desc: string;

  @IsNotEmpty({
    message: "yarn type id can't be empty",
  })
  @IsNumber(
    {
      allowNaN: false,
    },
    {
      message: 'yarn type id should be numeric value',
    },
  )
  yarn_type_id: number;

  @IsNotEmpty({
    message: "ply can't be empty",
  })
  @IsNumber(
    {
      allowNaN: false,
    },
    {
      message: 'ply should be numeric value',
    },
  )
  ply: number;

  @IsNotEmpty({
    message: "rate can't be empty",
  })
  @IsNumber(
    {
      allowNaN: false,
    },
    {
      message: 'rate should be numeric value',
    },
  )
  rate: number;

  @IsNotEmpty({
    message: "count can't be empty",
  })
  @IsNumber(
    {
      allowNaN: false,
    },
    {
      message: 'count should be numeric value',
    },
  )
  count: number;

  @IsNotEmpty({
    message: "eng_count can't be empty",
  })
  @IsNumber(
    {
      allowNaN: false,
    },
    {
      message: 'eng_count should be numeric value',
    },
  )
  eng_count: number;

  @IsNotEmpty({
    message: "denier can't be empty",
  })
  @IsNumber(
    {
      allowNaN: false,
    },
    {
      message: 'denier should be numeric value',
    },
  )
  denier: number;

  @IsNotEmpty({
    message: "quality id can't be empty",
  })
  @IsNumber(
    {
      allowNaN: false,
    },
    {
      message: 'quality id should be numeric value',
    },
  )
  quality_id: number;

  @IsNotEmpty({
    message: "twist can't be empty only S, Z or 0",
  })
  @MaxLength(1, {
    message: "twist length can't be more 12 charater",
  })
  twist: string;

  @IsNotEmpty({
    message: "color id can't be empty",
  })
  @IsNumber(
    {
      allowNaN: false,
    },
    {
      message: 'color id should be numeric value',
    },
  )
  color_id: number;

  @IsNotEmpty({
    message: 'gryOrGey should be defined',
  })
  @IsEnum(YarnGryDyeEnum, {
    message: 'gryOrGey can only be grey or dyed',
  })
  @Transform(({ value }) => parseInt(value))
  gryOrGey: YarnGryDyeEnum;

  @IsNotEmpty({
    message: "category id can't be empty",
  })
  @IsNumber(
    {
      allowNaN: false,
    },
    {
      message: 'category id should be numeric value',
    },
  )
  ctgr_id: number;

  @IsNotEmpty({
    message: "group id can't be empty",
  })
  @IsNumber(
    {
      allowNaN: false,
    },
    {
      message: 'group id should be numeric value',
    },
  )
  group_id: number;

  @IsNotEmpty({
    message: "hsn id can't be empty",
  })
  @IsNumber(
    {
      allowNaN: false,
    },
    {
      message: 'hsn id should be numeric value',
    },
  )
  hsn_id: number;
}
