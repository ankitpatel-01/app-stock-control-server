import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PaginationMetaData {
  @ApiProperty()
  current_page: number;
  @ApiProperty()
  total_pages: number;
  @ApiProperty()
  per_page: number;
  @ApiProperty()
  total_items: number;
}
export class ResponseDto<T> {
  @ApiProperty()
  message: string;

  @ApiProperty()
  response: T;

  @ApiPropertyOptional()
  meta?: PaginationMetaData;
}
