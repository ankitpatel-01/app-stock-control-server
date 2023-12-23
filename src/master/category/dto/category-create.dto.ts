import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({
    message: "category description can't be empty",
  })
  @MaxLength(40, {
    message: "category description length can't be more 40 charater",
  })
  category_desc: string;
}
