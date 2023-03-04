import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataFound, NoDataFound, PerPageLimit } from 'src/shared/constant/constant';
import { ResponseDto } from 'src/shared/dto/response.dto';

import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Color } from '../entities/color.entity';
import { HSN } from '../entities/hsn.entity';
import { Quality } from '../entities/quality.entity';
import { YarnGroup } from '../entities/yarn-group.entity';
import { YarnType } from '../entities/yarn-type.entity';
import { YarnMaster } from '../entities/yarn.entity';
import { CreateYarnDto } from './dto/create-yarn.dto';
import { UpdateYarnDto } from './dto/update-yarn.dto';

@Injectable()
export class YarnMasterService {

    constructor(
        @InjectRepository(YarnMaster)
        private _yarnMasterRespository: Repository<YarnMaster>,
        //relatons entity
        @InjectRepository(YarnType)
        private _yarnTypeRespository: Repository<YarnType>,
        @InjectRepository(Quality)
        private _qualityRespository: Repository<Quality>,
        @InjectRepository(Color)
        private _colorRepository: Repository<Color>,
        @InjectRepository(Category)
        private _categoryRepository: Repository<Category>,
        @InjectRepository(YarnGroup)
        private _yarnGroupRepository: Repository<YarnGroup>,
        @InjectRepository(HSN)
        private _hsnRespository: Repository<HSN>,
    ) { }


    // async getAllYarns(): Promise<YarnMaster[]> {
    //     try {
    //         return await this._yarnMasterRespository.find({
    //             where: {
    //                 isActive: 1,
    //                 ...{}
    //             },
    //             relations: {
    //                 yarn_type: true,
    //                 quality: true,
    //                 color: true,
    //                 category: true,
    //                 group: true,
    //                 hsn: true,
    //             },
    //             order: {
    //                 id: 'DESC'
    //             }

    //         })
    //     } catch (err) {
    //         return err;
    //     }
    // }

    async findAllYarn(
        search: string = null,
    ): Promise<ResponseDto<YarnMaster[]>> {
        try {

            const query = this._yarnMasterRespository.createQueryBuilder('yarn')
                .leftJoinAndSelect('yarn.yarn_type', 'yarn_type')
                .leftJoinAndSelect('yarn.quality', 'quality')
                .leftJoinAndSelect('yarn.color', 'color')
                .leftJoinAndSelect('yarn.category', 'category')
                .leftJoinAndSelect('yarn.group', 'group')
                .leftJoinAndSelect('yarn.hsn', 'hsn')
                .where("yarn.isActive = 1")
                .andWhere("yarn_type.isActive = 1")
                .andWhere("quality.isActive = 1")
                .andWhere("color.isActive = 1")
                .andWhere("category.isActive = 1")
                .andWhere("group.isActive = 1")
                .andWhere("hsn.isActive = 1")

            if (search) {
                query.andWhere('LOWER(yarn.yarn_desc) like LOWER(:search)', { search: `%${search}%` })
                    .orWhere('LOWER(yarn.yarn_code) like LOWER(:search)', { search: `%${search}%` });
            }

            const data: YarnMaster[] = await query.addOrderBy('yarn.id', "DESC").getMany();

            return {
                message: data.length == 0 ? NoDataFound : DataFound,
                response: data,
            };

        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    async paginateYarn(
        page: number = 1,
        limit: number = PerPageLimit,
        search: string = null,
    ): Promise<ResponseDto<YarnMaster[]>> {
        try {
            let data: YarnMaster[], total: number;

            const query = this._yarnMasterRespository.createQueryBuilder('yarn')
                .leftJoinAndSelect('yarn.yarn_type', 'yarn_type')
                .leftJoinAndSelect('yarn.quality', 'quality')
                .leftJoinAndSelect('yarn.color', 'color')
                .leftJoinAndSelect('yarn.category', 'category')
                .leftJoinAndSelect('yarn.group', 'group')
                .leftJoinAndSelect('yarn.hsn', 'hsn')
                .where("yarn.isActive = 1")
                .andWhere("yarn_type.isActive = 1")
                .andWhere("quality.isActive = 1")
                .andWhere("color.isActive = 1")
                .andWhere("category.isActive = 1")
                .andWhere("group.isActive = 1")
                .andWhere("hsn.isActive = 1")

            if (search) {
                page = 1;
                query.andWhere('LOWER(yarn.yarn_desc) like LOWER(:search)', { search: `%${search}%` })
                    .orWhere('LOWER(yarn.yarn_code) like LOWER(:search)', { search: `%${search}%` });
            }

            if (page == -1) {
                [data, total] = await query.getManyAndCount();
            } else {
                const skip = (page - 1) * limit;
                [data, total] = await query.addOrderBy('yarn.id', "DESC").take(limit).skip(skip).getManyAndCount();
            }

            return {
                message: data.length == 0 ? NoDataFound : DataFound,
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


    async createYarn(createYarnDto: CreateYarnDto): Promise<ResponseDto<null>> {
        try {
            const type: YarnType = await this.findYarnTypeById(createYarnDto.yarn_type_id);
            const quality: Quality = await this.findQualityById(createYarnDto.quality_id);
            const color: Color = await this.findColorById(createYarnDto.color_id);
            const category: Category = await this.findCategoryById(createYarnDto.ctgr_id);
            const group: YarnGroup = await this.findGroupById(createYarnDto.group_id);
            const hsn: HSN = await this.findHsnById(createYarnDto.hsn_id);

            const newYarn: YarnMaster = await this._yarnMasterRespository.create({
                yarn_code: createYarnDto.yarn_code,
                yarn_desc: createYarnDto.yarn_desc,
                yarn_type: type,
                ply: createYarnDto.ply,
                count: createYarnDto.count,
                quality: quality,
                twist: createYarnDto.twist,
                color: color,
                eng_count: createYarnDto.eng_count,
                denier: createYarnDto.denier,
                gryOrDey: createYarnDto.gryOrGey,
                category: category,
                group: group,
                hsn: hsn,
                rate: createYarnDto.rate,
            });
            const respone = await this._yarnMasterRespository.save(newYarn);

            if (respone) {
                return {
                    message: "yarn create sucessfully",
                    response: null,
                }
            } else {
                throw new InternalServerErrorException()
            }
        } catch (err) {
            if (err.code === "ER_DUP_ENTRY" && err.errno === 1062) {
                throw new ConflictException("Duplicate entry yarn code or yarn description already exists")
            }
            throw new InternalServerErrorException(err)
        }
    }

    async updateYarn(updateYarnDto: UpdateYarnDto): Promise<ResponseDto<null>> {
        try {
            const type: YarnType = await this.findYarnTypeById(updateYarnDto.yarn_type_id);
            const quality: Quality = await this.findQualityById(updateYarnDto.quality_id);
            const color: Color = await this.findColorById(updateYarnDto.color_id);
            const category: Category = await this.findCategoryById(updateYarnDto.ctgr_id);
            const group: YarnGroup = await this.findGroupById(updateYarnDto.group_id);
            const hsn: HSN = await this.findHsnById(updateYarnDto.hsn_id);

            const newYarn: YarnMaster = await this._yarnMasterRespository.create({
                id: updateYarnDto.id,//id to update
                yarn_code: updateYarnDto.yarn_code,
                yarn_desc: updateYarnDto.yarn_desc,
                yarn_type: type,
                ply: updateYarnDto.ply,
                count: updateYarnDto.count,
                quality: quality,
                twist: updateYarnDto.twist,
                color: color,
                eng_count: updateYarnDto.eng_count,
                denier: updateYarnDto.denier,
                gryOrDey: updateYarnDto.gryOrGey,
                category: category,
                group: group,
                hsn: hsn,
                rate: updateYarnDto.rate,
            });
            const respone = await this._yarnMasterRespository.save(newYarn);

            if (respone) {
                return {
                    message: "yarn updated sucessfully",
                    response: null,
                }
            } else {
                throw new InternalServerErrorException()
            }
        } catch (err) {
            if (err.code === "ER_DUP_ENTRY" && err.errno === 1062) {
                throw new ConflictException("Duplicate entry yarn code or yarn description already exists")
            }
            throw new InternalServerErrorException(err)
        }
    }

    async removeYarn(id: number): Promise<ResponseDto<null>> {

        const yarn = await this.findYarnById(id);

        if (yarn) {
            const result = await this._yarnMasterRespository.save({
                id,
                isActive: 0
            })

            if (result) {
                return {
                    message: "Yarn removed sucessfully",
                    response: null,
                }
            } else {
                throw new InternalServerErrorException()
            }
        } else {
            throw new NotFoundException("Quality dosn't exist");
        }
    }



    async findYarnById(id: number): Promise<YarnMaster> {
        const yarn: YarnMaster = await this._yarnMasterRespository.findOne({
            where: {
                id,
                isActive: 1
            },
        })

        if (yarn) {
            return yarn;
        }

        throw new NotFoundException(`yarn Type with id ${id} not found`);
    }

    //relation obj find
    //find yarn type
    async findYarnTypeById(id: number): Promise<YarnType> {
        const type: YarnType = await this._yarnTypeRespository.findOne({
            where: {
                id,
                isActive: 1
            },
        })

        if (type) {
            return type;
        }

        throw new NotFoundException(`yarn Type with id ${id} not found`);
    }

    //find quality
    async findQualityById(id: number): Promise<Quality> {
        const quality: Quality = await this._qualityRespository.findOne({
            where: {
                id,
                isActive: 1
            },
        })

        if (quality) {
            return quality;
        }

        throw new NotFoundException(`quality with id ${id} not found`);
    }

    //find color
    async findColorById(id: number): Promise<Color> {
        const color: Color = await this._colorRepository.findOne({
            where: {
                id,
                isActive: 1
            },
        })

        if (color) {
            return color;
        }

        throw new NotFoundException(`color with id ${id} not found`);
    }

    //find category
    async findCategoryById(id: number): Promise<Category> {
        const category: Category = await this._categoryRepository.findOne({
            where: {
                id,
                isActive: 1
            },
        })

        if (category) {
            return category;
        }

        throw new NotFoundException(`category with id ${id} not found`);
    }

    //find group
    async findGroupById(id: number): Promise<YarnGroup> {
        const group: YarnGroup = await this._yarnGroupRepository.findOne({
            where: {
                id,
                isActive: 1
            },
        })

        if (group) {
            return group;
        }

        throw new NotFoundException(`group with id ${id} not found`);
    }

    //find hsn
    async findHsnById(id: number): Promise<HSN> {
        const hsn: HSN = await this._hsnRespository.findOne({
            where: {
                id,
                isActive: 1
            },
        })

        if (hsn) {
            return hsn;
        }

        throw new NotFoundException(`hsn with id ${id} not found`);
    }
}
