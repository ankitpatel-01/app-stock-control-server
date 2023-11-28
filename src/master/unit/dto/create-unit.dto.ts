import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUnitDto {
  @IsNotEmpty({
    message: "unit description can't be empty",
  })
  @MaxLength(30, {
    message: "unit description length can't be more 30 charater",
  })
  unit_desc: string;

  @IsNotEmpty({
    message: "unit code can't be empty",
  })
  @MaxLength(10, {
    message: "unit code length can't be more 10 charater",
  })
  unit_name: string;
}
