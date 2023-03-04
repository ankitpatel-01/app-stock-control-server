import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerPageLimit } from 'src/shared/constant/constant';
import { ER_DUP_ENTRY, ER_DUP_ENTRY_NO } from 'src/shared/constant/error.const';
import { ResponseDto } from 'src/shared/dto/response.dto';

import { Repository } from 'typeorm';
import { YarnGroup } from '../entities/yarn-group.entity';
import { CreateYarnGroupDto } from './dto/create-yarn-grop.dto';
import { UpdateYarnGroupDto } from './dto/update-yarn-group.dto';

@Injectable()
export class YarnGroupService {
    constructor(
        @InjectRepository(YarnGroup)
        private _yarnGroupRepository: Repository<YarnGroup>) { }

    async getAllYarnGroup(search: string = null): Promise<ResponseDto<YarnGroup[]>> {
        try {

            const query = this._yarnGroupRepository.createQueryBuilder('yarnGroup')
                .where("yarnGroup.isActive = 1");

            if (search) {
                query.andWhere('LOWER(yarnGroup.yarn_grp_name) like LOWER(:search)', { search: `%${search}%` });
            }

            const data: YarnGroup[] = await query.getMany();

            return {
                message: data.length == 0 ? 'No data found.' : 'data found sucessfully.',
                response: data,
            };

        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    async paginateYarnGroup(
        page: number = 1,
        limit: number = PerPageLimit,
        search: string = null,
    ): Promise<ResponseDto<YarnGroup[]>> {

        try {
            let data: YarnGroup[], total: number;

            const query = this._yarnGroupRepository.createQueryBuilder('yarnGroup').where("yarnGroup.isActive = 1");

            if (search) {
                page = 1;
                query.where('LOWER(yarnGroup.yarn_grp_name) like LOWER(:search)', { search: `%${search}%` });
            }

            if (page == -1) {
                [data, total] = await query.getManyAndCount();
            } else {
                const skip = (page - 1) * limit;
                [data, total] = await query.take(limit).skip(skip).getManyAndCount();
            }

            return {
                message: data.length === 0 ? 'No data found.' : 'data found sucessfully.',
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

    async createYarnGroup(createYarnGroupDto: CreateYarnGroupDto): Promise<ResponseDto<null>> {
        try {
            const newYarnGroup: YarnGroup = await this._yarnGroupRepository.create({
                yarn_grp_name: createYarnGroupDto.yarn_grp_name,
            });

            const respone = await this._yarnGroupRepository.save(newYarnGroup);

            if (respone) {
                return {
                    message: "yarn group create sucessfully",
                    response: null,
                }
            }
        } catch (err) {
            if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
                throw new ConflictException("Duplicate entry yarn group already exists")
            }
            throw new InternalServerErrorException(err)
        }
    }

    async updateYarnGroup(updateYarnGroupDto: UpdateYarnGroupDto): Promise<ResponseDto<null>> {
        const yarnGroup: YarnGroup = await this.findYarnGroupById(updateYarnGroupDto.id);
        yarnGroup.yarn_grp_name = updateYarnGroupDto.yarn_grp_name;
        yarnGroup.isActive = 1;
        try {
            const respone = await this._yarnGroupRepository.save(yarnGroup);
            if (respone) {
                return {
                    message: "yarn group updated sucessfully",
                    response: null
                }
            }
        } catch (err) {
            if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
                throw new ConflictException("Duplicate entry yarn group already exists")
            }
            throw new InternalServerErrorException(err)
        }
    }

    async removeYarnGroup(id: number): Promise<ResponseDto<null>> {

        const yarnGroup = await this.findYarnGroupById(id);

        if (yarnGroup) {
            const result = await this._yarnGroupRepository.save({
                id,
                isActive: 0
            })

            if (result) {
                return {
                    message: "Yarn group removed sucessfully",
                    response: null,

                }
            } else {
                throw new InternalServerErrorException()
            }
        } else {
            throw new NotFoundException("Yarn group doesn't exist");
        }
    }

    async findYarnGroupById(id: number): Promise<YarnGroup> {
        const yarnGroup: YarnGroup = await this._yarnGroupRepository.findOne({
            where: {
                id,
                isActive: 1
            }
        })

        if (yarnGroup) {
            return yarnGroup;
        }

        throw new NotFoundException(`yarn group with id ${id} not found`);
    }
}
