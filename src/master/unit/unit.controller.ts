import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { GetCurrentUserId, Public } from 'src/common/decorator';
import { PaginateDto } from 'src/shared/dto/pagination.dto';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { Unit } from '../entities/unit.entity';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UnitService } from './unit.service';

@Controller('master/unit')
export class UnitController {

    constructor(private _unitService: UnitService) { }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('')
    getAllUnit(@Query() query: PaginateDto): Promise<ResponseDto<Unit[]>> {
        if (query.page) {
            return this._unitService.paginateUnit(query.page, query.limit, query.search);
        }
        return this._unitService.getAllUnit(query.search);
    }

    @Post('create')
    createUnit(@Body() createUnitDto: CreateUnitDto, @GetCurrentUserId() userId: number): Promise<ResponseDto<null>> {
        return this._unitService.createUnit(createUnitDto, userId);
    }

    @Put('update')
    updateUnit(@Body() updateUnitDto: UpdateUnitDto, @GetCurrentUserId() userId: number): Promise<ResponseDto<null>> {
        return this._unitService.updateUnit(updateUnitDto, userId);
    }

    @Delete('remove/:id')
    removeUnit(@Param('id', ParseIntPipe) id: number, @GetCurrentUserId() userId: number): Promise<ResponseDto<null>> {
        return this._unitService.removeUnit(id, userId);
    }
}
