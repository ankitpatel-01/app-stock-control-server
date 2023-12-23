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

import { Category } from '../entities/category.entity';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/category-create.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('master/category')
@ApiTags('Yarn Master')
@ApiSecurity('access-key')
export class CategoryController {
  constructor(private _categoryService: CategoryService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  getAllCategory(@Query() query: PaginateDto): Promise<ResponseDto<Category[]>> {
    if (query.page) {
      return this._categoryService.paginateCategory(query.page, query.limit, query.search);
    }
    return this._categoryService.getAllCategory(query.search);
  }

  @Post('create')
  createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<ResponseDto<null>> {
    return this._categoryService.createCategory(createCategoryDto);
  }

  @Put('update')
  updateCategory(@Body() updateCategoryDto: UpdateCategoryDto): Promise<ResponseDto<null>> {
    return this._categoryService.updateColor(updateCategoryDto);
  }

  @Delete('remove/:id')
  removeCategory(@Param('id', ParseIntPipe) id: number): Promise<ResponseDto<null>> {
    return this._categoryService.removeCategory(id);
  }
}
