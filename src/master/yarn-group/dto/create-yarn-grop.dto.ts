import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateYarnGroupDto {
  @IsNotEmpty({
    message: "yarn group description can't be empty",
  })
  @MaxLength(30, {
    message: "yarn group description length can't be more 30 charater",
  })
  yarn_grp_name: string;
}
