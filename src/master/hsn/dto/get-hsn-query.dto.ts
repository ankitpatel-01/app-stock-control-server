import { IsOptional } from 'class-validator';
import { PaginateDto } from 'src/shared/dto/pagination.dto';

export class QueryHsnDto extends PaginateDto {
  @IsOptional()
  gst: boolean;
}
