import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';
import { HsnType } from 'src/master/entities/hsn.entity';

export class CreateHsnDto {
  @IsNotEmpty({
    message: "hsn code can't be empty",
  })
  @IsNumber(
    {
      allowNaN: false,
    },
    {
      message: 'hsn code should be numeric value',
    },
  )
  @Transform(({ value }) => parseInt(value))
  hsn_code: number;

  @IsNotEmpty({
    message: "hsn description can't be empty",
  })
  @MaxLength(30, {
    message: "hsn description length can't be more 30 charater",
  })
  hsn_desc: string;

  @IsNotEmpty({
    message: 'hsn type should be defined',
  })
  @IsEnum(HsnType, {
    message: 'hsn type can only be hsn or service',
  })
  @Transform(({ value }) => parseInt(value))
  hsn_type: HsnType;

  @IsNotEmpty({
    message: "gst id can't be empty",
  })
  @IsNumber(
    {
      allowNaN: false,
    },
    {
      message: 'gst id should be numeric value',
    },
  )
  @Transform(({ value }) => parseInt(value))
  gst_id: number;
}
