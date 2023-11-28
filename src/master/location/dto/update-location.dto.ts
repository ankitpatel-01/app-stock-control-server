import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class UpdateLocationDto {
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
    message: "location name can't be empty",
  })
  @MaxLength(50, {
    message: "location name length can't be more 50 charater",
  })
  location_name: string;

  @IsNotEmpty({
    message: "factory name can't be empty",
  })
  @MaxLength(50, {
    message: "factory name length can't be more 50 charater",
  })
  factory_name: string;

  @IsNotEmpty({
    message: "factory city can't be empty",
  })
  @MaxLength(50, {
    message: "factory city length can't be more 50 charater",
  })
  factory_city: string;
}
