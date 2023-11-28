import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class CreateStateDto {
  @IsNotEmpty({
    message: "name can't be empty",
  })
  @MaxLength(100, {
    message: "name length can't be more 100 charater",
  })
  name: string;

  @IsNotEmpty({
    message: "state code can't be empty",
  })
  @MaxLength(2, {
    message: "state code length can't be more 2 charater",
  })
  state_cd: string;

  @IsNotEmpty({
    message: "vehicle code code can't be empty",
  })
  @MaxLength(2, {
    message: "vehicle code length can't be more 2 charater",
  })
  vehicle_code: string;

  @IsNotEmpty({
    message: "state type can't be empty",
  })
  @MaxLength(10, {
    message: "state type  length can't be more 10 charater",
  })
  type: string;

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
  srl_no: number;

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
  gst_stcd: number;
}
