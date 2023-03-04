import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { PaginateDto } from 'src/shared/dto/pagination.dto';
import { ResponseDto } from 'src/shared/dto/response.dto';

import { Color } from '../entities/color.entity';
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Controller('master/color')
export class ColorController {
    constructor(private _colorService: ColorService) { }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('')
    getAllColor(@Query() query: PaginateDto): Promise<ResponseDto<Color[]>> {
        if (query.page) {
            return this._colorService.paginateColor(query.page, query.limit, query.search);
        }
        return this._colorService.getAllColor(query.search);
    }

    @Post('create')
    createColor(@Body() createColorDto: CreateColorDto): Promise<ResponseDto<null>> {
        return this._colorService.createColor(createColorDto);
    }

    @Put('update')
    updateColor(@Body() updateColorDto: UpdateColorDto): Promise<ResponseDto<null>> {
        return this._colorService.updateColor(updateColorDto);
    }

    @Delete('remove/:id')
    removeColor(@Param('id', ParseIntPipe) id: number): Promise<ResponseDto<null>> {
        return this._colorService.removeColor(id);
    }
}
