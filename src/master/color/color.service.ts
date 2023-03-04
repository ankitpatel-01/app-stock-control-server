import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerPageLimit } from 'src/shared/constant/constant';
import { ER_DUP_ENTRY, ER_DUP_ENTRY_NO } from 'src/shared/constant/error.const';
import { ResponseDto } from 'src/shared/dto/response.dto';

import { Repository } from 'typeorm';
import { Color } from '../entities/color.entity';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Injectable()
export class ColorService {
    constructor(
        @InjectRepository(Color)
        private _colorRepository: Repository<Color>) { }

    async getAllColor(search: string = null): Promise<ResponseDto<Color[]>> {
        try {

            const query = this._colorRepository.createQueryBuilder('c')
                .where("c.isActive = 1");

            if (search) {
                query.andWhere('LOWER(c.color_desc) like LOWER(:search)', { search: `%${search}%` })
                    .orWhere('LOWER(c.color_code) like LOWER(:search)', { search: `%${search}%` });
            }

            const data: Color[] = await query.getMany();

            return {
                message: data.length == 0 ? 'No data found.' : 'data found sucessfully.',
                response: data,
            };

        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    async paginateColor(
        page: number = 1,
        limit: number = PerPageLimit,
        search: string = null,
    ): Promise<ResponseDto<Color[]>> {
        try {
            let data: Color[], total: number;

            const query = this._colorRepository.createQueryBuilder('c').where("c.isActive = 1");

            if (search) {
                page = 1;
                query.where('LOWER(c.color_desc) like LOWER(:search)', { search: `%${search}%` })
                    .orWhere('LOWER(c.color_code) like LOWER(:search)', { search: `%${search}%` });
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

    async createColor(createColorDto: CreateColorDto): Promise<ResponseDto<null>> {
        try {
            const newColor: Color = await this._colorRepository.create({
                color_desc: createColorDto.color_desc,
                color_code: createColorDto.color_code,
            });
            const respone = await this._colorRepository.save(newColor);

            if (respone) {
                return {
                    message: "new color create sucessfully",
                    response: null,
                }
            }
        } catch (err) {
            if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
                throw new ConflictException("Duplicate entry color description or code already exists")
            }
            throw new InternalServerErrorException(err)
        }
    }

    async updateColor(updateColorDto: UpdateColorDto): Promise<ResponseDto<null>> {
        const color: Color = await this.findColorById(updateColorDto.id);
        color.color_desc = updateColorDto.color_desc;
        color.color_code = updateColorDto.color_code;
        color.isActive = 1;
        try {
            const respone = await this._colorRepository.save(color);
            if (respone) {
                return {
                    message: "color updated sucessfully",
                    response: null
                }
            }
        } catch (err) {
            if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
                throw new ConflictException("Duplicate entry color description or code already exists")
            }
            throw new InternalServerErrorException(err)
        }
    }

    async removeColor(id: number): Promise<ResponseDto<null>> {

        const color = await this.findColorById(id)

        if (color) {
            const result = await this._colorRepository.save({
                id,
                isActive: 0
            })

            if (result) {
                return {
                    message: "Color removed sucessfully",
                    response: null,
                }
            }
        } else {
            throw new NotFoundException("Color doesn't exist");
        }
    }

    async findColorById(id: number): Promise<Color> {
        const color = await this._colorRepository.findOne({
            where: {
                id,
                isActive: 1
            }
        })

        if (color) {
            return color;
        }

        throw new NotFoundException(`color with id ${id} not found`);
    }
}
