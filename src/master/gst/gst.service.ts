import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerPageLimit } from 'src/shared/constant/constant';
import { ER_DUP_ENTRY, ER_DUP_ENTRY_NO } from 'src/shared/constant/error.const';
import { ResponseDto } from 'src/shared/dto/response.dto';

import { Repository } from 'typeorm';
import { GST } from '../entities/gst.entity';
import { CreateGstDto } from './dto/create-gst.dto';
import { UpdateGstDto } from './dto/update-gst.dto';

@Injectable()
export class GstService {
    constructor(
        @InjectRepository(GST)
        private _gstRepository: Repository<GST>) { }

    async getAllGST(search: string = null): Promise<ResponseDto<GST[]>> {
        try {

            const query = this._gstRepository.createQueryBuilder('gst')
                .where("gst.isActive = 1");

            if (search) {
                query.andWhere('LOWER(gst.gst_desc) like LOWER(:search)', { search: `%${search}%` });
            }

            const data: GST[] = await query.orderBy('gst.id', 'DESC').getMany();

            return {
                message: data.length == 0 ? 'No data found.' : 'data found sucessfully.',
                response: data,
            };

        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    async paginateGST(
        page: number = 1,
        limit: number = PerPageLimit,
        search: string = null,
    ): Promise<ResponseDto<GST[]>> {
        try {
            let data: GST[], total: number;

            const query = this._gstRepository.createQueryBuilder('gst').where("gst.isActive = 1");

            if (search) {
                page = 1;
                query.where('LOWER(gst.gst_desc) like LOWER(:search)', { search: `%${search}%` });
            }

            if (page == -1) {
                [data, total] = await query.getManyAndCount();
            } else {
                const skip = (page - 1) * limit;
                [data, total] = await query.orderBy('gst.id', 'DESC').take(limit).skip(skip).getManyAndCount();
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


    async createGST(createGSTDto: CreateGstDto): Promise<ResponseDto<null>> {
        try {
            const newGST: GST = await this._gstRepository.create({
                gst_desc: createGSTDto.gst_desc,
                gst_rate: createGSTDto.gst_rate,
                igst: createGSTDto.igst,
                sgst: createGSTDto.sgst,
                cgst: createGSTDto.cgst,
            });
            const respone = await this._gstRepository.save(newGST);

            if (respone) {
                return {
                    message: "gst create sucessfully",
                    response: null,
                }
            }
        } catch (err) {
            if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
                throw new ConflictException("Duplicate entry gst description or code already exists")
            }
            throw new InternalServerErrorException(err)
        }
    }

    async updateGST(updateGSTDto: UpdateGstDto): Promise<ResponseDto<null>> {
        const gst: GST = await this.findGstById(updateGSTDto.id);
        gst.gst_desc = updateGSTDto.gst_desc;
        gst.gst_rate = updateGSTDto.gst_rate;
        gst.sgst = updateGSTDto.sgst;
        gst.cgst = updateGSTDto.cgst;
        gst.igst = updateGSTDto.igst;
        gst.isActive = 1;
        try {
            const respone = await this._gstRepository.save(gst);
            if (respone) {
                return {
                    message: "gst updated sucessfully",
                    response: null
                }
            }
        } catch (err) {
            if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
                throw new ConflictException("Duplicate entry gst description or code already exists")
            }
            throw new InternalServerErrorException(err)
        }
    }

    async removeGST(id: number): Promise<ResponseDto<null>> {

        const gst: GST = await this.findGstById(id);

        if (gst) {
            const result = await this._gstRepository.save({
                id,
                isActive: 0
            })

            if (result) {
                return {
                    message: "GST removed sucessfully",
                    response: null,
                }
            }
        } else {
            throw new NotFoundException("GST doesn't exist");
        }
    }

    async findGstById(id: number): Promise<GST> {
        const gst: GST = await this._gstRepository.findOne({
            where: {
                id,
                isActive: 1
            }
        })
        if (gst) {
            return gst;
        }
        throw new NotFoundException(`gst with id ${id} not found`)
    }
}
