import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { PaginateDto } from 'src/shared/dto/pagination.dto';
import { ResponseDto } from 'src/shared/dto/response.dto';

import { GST } from '../entities/gst.entity';
import { CreateGstDto } from './dto/create-gst.dto';
import { UpdateGstDto } from './dto/update-gst.dto';
import { GstService } from './gst.service';

@Controller('master/gst')
export class GstController {
    constructor(private _gstService: GstService) { }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('')
    getAllGST(@Query() query: PaginateDto): Promise<ResponseDto<GST[]>> {
        if (query.page) {
            return this._gstService.paginateGST(query.page, query.limit, query.search);
        }
        return this._gstService.getAllGST(query.search);
    }

    @Post('create')
    createGST(@Body() createGSTDto: CreateGstDto): Promise<ResponseDto<null>> {
        return this._gstService.createGST(createGSTDto);
    }

    @Put('update')
    updateGST(@Body() updateGSTDto: UpdateGstDto): Promise<ResponseDto<null>> {
        return this._gstService.updateGST(updateGSTDto);
    }

    @Delete('remove/:id')
    removeGST(@Param('id', ParseIntPipe) id: number): Promise<ResponseDto<null>> {
        return this._gstService.removeGST(id);
    }
}
