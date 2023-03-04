import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerPageLimit } from 'src/shared/constant/constant';
import { ER_DUP_ENTRY, ER_DUP_ENTRY_NO } from 'src/shared/constant/error.const';
import { ResponseDto } from 'src/shared/dto/response.dto';

import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Color } from '../entities/color.entity';
import { CreateCategoryDto } from './dto/category-create.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(Category)
        private _categoryRepository: Repository<Category>) { }

    async getAllCategory(search: string = null): Promise<ResponseDto<Category[]>> {
        try {

            const query = this._categoryRepository.createQueryBuilder('category')
                .where("category.isActive = 1");

            if (search) {
                query.andWhere('LOWER(category.category_desc) like LOWER(:search)', { search: `%${search}%` });
            }

            const data: Category[] = await query.getMany();

            return {
                message: data.length == 0 ? 'No data found.' : 'data found sucessfully.',
                response: data,
            };

        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    async paginateCategory(
        page: number = 1,
        limit: number = PerPageLimit,
        search: string = null,
    ): Promise<ResponseDto<Category[]>> {
        try {
            let data: Category[], total: number;

            const query = this._categoryRepository.createQueryBuilder('category').where("category.isActive = 1");

            if (search) {
                page = 1;
                query.where('LOWER(category.category_desc) like LOWER(:search)', { search: `%${search}%` });
            }

            if (page == -1) {
                [data, total] = await query.getManyAndCount();
            } else {
                const skip = (page - 1) * limit;
                [data, total] = await query.take(limit).skip(skip).getManyAndCount();
            }

            return {
                message: data.length == 0 ? 'No data found.' : 'data found sucessfully.',
                response: data,
                meta: {
                    current_page: parseInt(page.toString()),
                    total_pages: Math.ceil(total / limit),
                    per_page: parseInt(limit.toString()),
                    total_items: total,
                }
            };

        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<ResponseDto<null>> {
        try {
            const newCategory: Category = await this._categoryRepository.create({
                category_desc: createCategoryDto.category_desc,
            });

            const respone = await this._categoryRepository.save(newCategory);

            if (respone) {
                return {
                    message: "category create sucessfully",
                    response: null,
                }
            }
        } catch (err) {
            if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
                throw new ConflictException("Duplicate entry category already exists")
            }
            throw new InternalServerErrorException(err)
        }
    }

    async updateColor(updateCategoryDto: UpdateCategoryDto): Promise<ResponseDto<null>> {
        const category: Category = await this.findCategoryById(updateCategoryDto.id);
        category.category_desc = updateCategoryDto.category_desc;
        category.isActive = 1;
        try {
            const respone = await this._categoryRepository.save(category);
            if (respone) {
                return {
                    message: "category updated sucessfully",
                    response: null
                }
            }
        } catch (err) {
            if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
                throw new ConflictException("Duplicate entry category already exists")
            }
            throw new InternalServerErrorException(err)
        }
    }

    async removeCategory(id: number): Promise<ResponseDto<null>> {

        const category = await this.findCategoryById(id);

        if (category) {
            const result = await this._categoryRepository.save({
                id,
                isActive: 0
            })

            if (result) {
                return {
                    message: "Category removed sucessfully",
                    response: null,

                }
            } else {
                throw new InternalServerErrorException()
            }
        } else {
            throw new NotFoundException("Category doesn't exist");
        }
    }

    async findCategoryById(id: number): Promise<Category> {
        const category: Category = await this._categoryRepository.findOne({
            where: {
                id,
                isActive: 1
            }
        })

        if (category) {
            return category;
        }

        throw new NotFoundException(`category with id ${id} not found`);
    }

}
