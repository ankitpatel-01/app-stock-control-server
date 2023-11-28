import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class UpdateColorDto {
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
  @Transform(({ value }) => parseInt(value))
  id: number;

  @IsNotEmpty({
    message: "color description can't be empty",
  })
  @MaxLength(30, {
    message: "color description length can't be more 30 charater",
  })
  color_desc: string;

  @IsNotEmpty({
    message: "color code can't be empty",
  })
  @MaxLength(3, {
    message: "color code length can't be more 3 charater",
  })
  color_code: string;
}
