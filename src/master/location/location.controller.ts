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
import { GetCurrentUserId } from 'src/common/decorator';
import { PaginateDto } from 'src/shared/dto/pagination.dto';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { Location } from '../entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationService } from './location.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('master/location')
@ApiTags('Miscellaneous Master')
@ApiSecurity('access-key')
export class LocationController {
  constructor(private _locationService: LocationService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  getAllLocation(
    @Query() query: PaginateDto,
  ): Promise<ResponseDto<Location[]>> {
    if (query.page) {
      return this._locationService.paginateLocation(
        query.page,
        query.limit,
        query.search,
      );
    }
    return this._locationService.getAllLocation(query.search);
  }

  @Post('create')
  createLocation(
    @Body() createLocationDto: CreateLocationDto,
    @GetCurrentUserId() userId: number,
  ): Promise<ResponseDto<null>> {
    return this._locationService.createLocation(createLocationDto, userId);
  }

  @Put('update')
  updateLocation(
    @Body() updateLocationDto: UpdateLocationDto,
    @GetCurrentUserId() userId: number,
  ): Promise<ResponseDto<null>> {
    return this._locationService.updateLocation(updateLocationDto, userId);
  }

  @Delete('remove/:id')
  removeLocation(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUserId() userId: number,
  ): Promise<ResponseDto<null>> {
    return this._locationService.removeLocation(id, userId);
  }
}
