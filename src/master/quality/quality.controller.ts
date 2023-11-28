import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { PaginateDto } from 'src/shared/dto/pagination.dto';
import { ResponseDto } from 'src/shared/dto/response.dto';

import { Quality } from '../entities/quality.entity';
import { CreateQualityDto } from './dto/create-quality.dto';
import { UpdateQualityDto } from './dto/update-quality.dto';
import { QualityService } from './quality.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('master/quality')
@ApiTags('Yarn Master')
@ApiSecurity('access-key')
export class QualityController {
  constructor(private _qualityService: QualityService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  @ApiSecurity('access-key')
  getAllQuality(@Query() query: PaginateDto): Promise<ResponseDto<Quality[]>> {
    if (query.page) {
      return this._qualityService.paginateQuality(query.page, query.limit, query.search);
    }
    return this._qualityService.getAllQuality(query.search);
  }

  @Post('create')
  createQuality(@Body() createQualityDto: CreateQualityDto): Promise<ResponseDto<null>> {
    return this._qualityService.createQuality(createQualityDto);
  }

  @Put('update')
  updateQuality(@Body() updateQualityDto: UpdateQualityDto): Promise<ResponseDto<null>> {
    return this._qualityService.updatedQuality(updateQualityDto);
  }

  @Delete('remove/:id')
  removeQuality(@Param('id', ParseIntPipe) id: number): Promise<ResponseDto<null>> {
    return this._qualityService.removeQuality(id);
  }
}
