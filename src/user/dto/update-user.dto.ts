export class UpdateUserDto {
  id: number;
  name: string;
  full_name?: string;
  username?: string;
  password?: string;
  hashdRt?: string;
}
