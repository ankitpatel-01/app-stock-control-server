import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { PaginateDto } from 'src/shared/dto/pagination.dto';
import { ResponseDto } from 'src/shared/dto/response.dto';

import { HSN } from '../entities/hsn.entity';
import { CreateHsnDto } from './dto/create-hsn.dto';
import { QueryHsnDto } from './dto/get-hsn-query.dto';
import { UpdateHsnDto } from './dto/update-hsn.dto';
import { HsnService } from './hsn.service';

@Controller('master/hsn')
export class HsnController {

    constructor(private _hsnService: HsnService) { }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('')
    getAllHsn(@Query() query: QueryHsnDto): Promise<ResponseDto<HSN[]>> {
        if (query.page) {
            return this._hsnService.paginateHsn(query.page, query.limit, query.search, query.gst);
        }
        return this._hsnService.getAllHsn(query.search, query.gst);
    }

    @Post('create')
    createHsn(@Body() createHsnDto: CreateHsnDto): Promise<ResponseDto<null>> {
        return this._hsnService.createHsn(createHsnDto);
    }

    @Put('update')
    updateHsn(@Body() updateHsnDto: UpdateHsnDto): Promise<ResponseDto<null>> {
        return this._hsnService.updateHsn(updateHsnDto);
    }

    @Delete('remove/:id')
    removeHsn(@Param('id', ParseIntPipe) id: number): Promise<ResponseDto<null>> {
        return this._hsnService.removeHsn(id);
    }
}