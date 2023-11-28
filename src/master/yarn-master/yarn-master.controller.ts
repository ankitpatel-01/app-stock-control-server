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

import { YarnMaster } from '../entities/yarn.entity';
import { CreateYarnDto } from './dto/create-yarn.dto';
import { UpdateYarnDto } from './dto/update-yarn.dto';
import { YarnMasterService } from './yarn-master.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('master/yarn-master')
@ApiTags('Yarn Master')
@ApiSecurity('access-key')
export class YarnMasterController {
  constructor(private _yarnMasterService: YarnMasterService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  getAllYarn(@Query() query: PaginateDto): Promise<ResponseDto<YarnMaster[]>> {
    if (query.page) {
      return this._yarnMasterService.paginateYarn(query.page, query.limit, query.search);
    }
    return this._yarnMasterService.findAllYarn(query.search);
  }

  @Post('create')
  createYarn(@Body() yarnCreateDto: CreateYarnDto): Promise<ResponseDto<null>> {
    return this._yarnMasterService.createYarn(yarnCreateDto);
  }

  @Put('update')
  updateYarn(@Body() yarnUpdateDto: UpdateYarnDto): Promise<ResponseDto<null>> {
    return this._yarnMasterService.updateYarn(yarnUpdateDto);
  }

  @Delete('remove/:id')
  removeYarn(@Param('id', ParseIntPipe) id: number): Promise<ResponseDto<null>> {
    return this._yarnMasterService.removeYarn(id);
  }
}
