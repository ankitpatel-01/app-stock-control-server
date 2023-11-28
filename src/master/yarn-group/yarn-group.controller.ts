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

import { YarnGroup } from '../entities/yarn-group.entity';
import { CreateYarnGroupDto } from './dto/create-yarn-grop.dto';
import { UpdateYarnGroupDto } from './dto/update-yarn-group.dto';
import { YarnGroupService } from './yarn-group.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('master/yarn-group')
@ApiTags('Yarn Master')
@ApiSecurity('access-key')
export class YarnGroupController {
  constructor(private _yarnGroupService: YarnGroupService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  getAllYarnGroup(
    @Query() query: PaginateDto,
  ): Promise<ResponseDto<YarnGroup[]>> {
    if (query.page) {
      return this._yarnGroupService.paginateYarnGroup(
        query.page,
        query.limit,
        query.search,
      );
    }
    return this._yarnGroupService.getAllYarnGroup(query.search);
  }

  @Post('create')
  createYarnGroup(
    @Body() createYarnGroupDto: CreateYarnGroupDto,
  ): Promise<ResponseDto<null>> {
    return this._yarnGroupService.createYarnGroup(createYarnGroupDto);
  }

  @Put('update')
  UpdateYarnGroup(
    @Body() updateYarnGroupDto: UpdateYarnGroupDto,
  ): Promise<ResponseDto<null>> {
    return this._yarnGroupService.updateYarnGroup(updateYarnGroupDto);
  }

  @Delete('remove/:id')
  removeYarnGroup(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<null>> {
    return this._yarnGroupService.removeYarnGroup(id);
  }
}
