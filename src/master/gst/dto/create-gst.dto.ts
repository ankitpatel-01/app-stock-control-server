import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class CreateGstDto {
  @IsNotEmpty({
    message: "gst description can't be empty",
  })
  @MaxLength(30, {
    message: "gst description length can't be more 30 charater",
  })
  gst_desc: string;

  @IsNotEmpty({
    message: "gst rate can't be empty",
  })
  @IsNumber(
    {
      allowNaN: false,
    },
    {
      message: 'gst rate should be numeric value',
    },
  )
  @Transform(({ value }) => parseInt(value))
  gst_rate: number;

  @IsNotEmpty({
    message: "igst can't be empty",
  })
  @IsNumber(
    {
      allowNaN: false,
    },
    {
      message: 'igst should be numeric value',
    },
  )
  @Transform(({ value }) => parseInt(value))
  igst: number;

  @IsNotEmpty({
    message: "sgst can't be empty",
  })
  @IsNumber(
    {
      allowNaN: false,
    },
    {
      message: 'sgst should be numeric value',
    },
  )
  @Transform(({ value }) => parseInt(value))
  sgst: number;

  @IsNotEmpty({
    message: "cgst can't be empty",
  })
  @IsNumber(
    {
      allowNaN: false,
    },
    {
      message: 'cgst should be numeric value',
    },
  )
  @Transform(({ value }) => parseInt(value))
  cgst: number;
}
