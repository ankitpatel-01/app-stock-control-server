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

import { YarnType } from '../entities/yarn-type.entity';
import { CreateYarnTypeDto } from './dto/create-yarn-type.dto';
import { UpdateYarnTypeDto } from './dto/update-yarn-type.dto';
import { YarnTypeService } from './yarn-type.service';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('master/yarn-type')
@ApiTags('Yarn Master')
@ApiSecurity('access-key')
export class YarnTypeController {
  constructor(private _yarnTypeService: YarnTypeService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  @ApiResponse({
    status: 200,
    description: 'data found sucessfully.',
    type: YarnType,
    isArray: true,
  })
  getYarnType(@Query() query: PaginateDto): Promise<ResponseDto<YarnType[]>> {
    if (query.page) {
      return this._yarnTypeService.paginateYarnType(
        query.page,
        query.limit,
        query.search,
      );
    }
    return this._yarnTypeService.findAllYarnType(query.search);
  }

  @Post('create')
  @ApiResponse({
    status: 200,
    description: 'Yarn type create sucessfully',
    type: null,
    isArray: false,
  })
  createYarnType(
    @Body() createYarnTypeDto: CreateYarnTypeDto,
  ): Promise<ResponseDto<null>> {
    return this._yarnTypeService.createYarnType(createYarnTypeDto);
  }

  @Put('update')
  @ApiResponse({
    status: 200,
    description: 'Yarn type update sucessfully',
    type: null,
    isArray: false,
  })
  updateYarnType(
    @Body() updateYarnTypeDto: UpdateYarnTypeDto,
  ): Promise<ResponseDto<null>> {
    return this._yarnTypeService.updateYarnType(updateYarnTypeDto);
  }

  @Delete('remove/:id')
  @ApiResponse({
    status: 200,
    description: 'Yarn type removed sucessfully',
    type: null,
    isArray: false,
  })
  removeYarnType(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<null>> {
    return this._yarnTypeService.removeYarnType(id);
  }
}
