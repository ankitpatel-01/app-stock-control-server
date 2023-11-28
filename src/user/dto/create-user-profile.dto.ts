import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserProfileDTO {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsOptional()
  middle_name: string;

  @IsString()
  @IsOptional()
  last_name: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsOptional()
  address1: string;

  @IsNumber()
  @IsOptional()
  country_id: number;

  @IsString()
  @IsOptional()
  city: string;

  @IsNumber()
  @IsOptional()
  state_id: number;

  @IsNumber()
  @IsOptional()
  pinCode: number;

  @IsString()
  @IsOptional()
  email: string;

  @IsNumber()
  @IsOptional()
  mobile1: number;

  @IsNumber()
  @IsOptional()
  mobile2: number;
}
