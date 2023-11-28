import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerPageLimit } from 'src/shared/constant/constant';
import { ER_DUP_ENTRY, ER_DUP_ENTRY_NO } from 'src/shared/constant/error.const';
import { ResponseDto } from 'src/shared/dto/response.dto';

import { Repository } from 'typeorm';
import { GST } from '../entities/gst.entity';
import { HSN } from '../entities/hsn.entity';
import { CreateHsnDto } from './dto/create-hsn.dto';
import { UpdateHsnDto } from './dto/update-hsn.dto';

@Injectable()
export class HsnService {
  constructor(
    @InjectRepository(HSN)
    private _hsnRespository: Repository<HSN>,
    @InjectRepository(GST)
    private _gstRespository: Repository<GST>,
  ) {}

  async getAllHsn(
    search: string = null,
    gst: boolean = false,
  ): Promise<ResponseDto<HSN[]>> {
    try {
      const query = this._hsnRespository
        .createQueryBuilder('hsn')
        .where('hsn.isActive = 1');

      if (gst) {
        query
          .leftJoin('hsn.gst', 'gst')
          .addSelect(['gst.id', 'gst.gst_desc'])
          .where('gst.isActive = 1');
      }

      if (search) {
        query
          .andWhere('LOWER(hsn.hsn_code) like LOWER(:search)', {
            search: `%${search}%`,
          })
          .orWhere('LOWER(hsn.hsn_desc) like LOWER(:search)', {
            search: `%${search}%`,
          });
      }

      const data: HSN[] = await query.addOrderBy('hsn.id', 'DESC').getMany();

      return {
        message:
          data.length == 0 ? 'No data found.' : 'data found sucessfully.',
        response: data,
      };
    } catch (err) {
      throw new InternalServerErrorException('somethings went wrong');
    }
  }

  async paginateHsn(
    page: number = 1,
    limit: number = PerPageLimit,
    search: string = null,
    gst: boolean = false,
  ): Promise<ResponseDto<HSN[]>> {
    try {
      let data: HSN[], total: number;

      const query = this._hsnRespository
        .createQueryBuilder('hsn')
        .where('hsn.isActive = 1');

      if (gst) {
        query
          .leftJoin('hsn.gst', 'gst')
          .addSelect(['gst.id', 'gst.gst_desc'])
          .andWhere('gst.isActive = 1');
      }

      if (search) {
        page = 1;
        query
          .andWhere('LOWER(hsn.hsn_code) like LOWER(:search)', {
            search: `%${search}%`,
          })
          .orWhere('LOWER(hsn.hsn_desc) like LOWER(:search)', {
            search: `%${search}%`,
          });
      }

      if (page == -1) {
        [data, total] = await query
          .addOrderBy('hsn.id', 'ASC')
          .getManyAndCount();
      } else {
        const skip = (page - 1) * limit;
        [data, total] = await query
          .addOrderBy('hsn.id', 'DESC')
          .take(limit)
          .skip(skip)
          .getManyAndCount();
      }

      return {
        message:
          data.length == 0 ? 'No data found.' : 'data found sucessfully.',
        response: data,
        meta: {
          current_page: parseInt(page.toString()),
          total_pages: Math.ceil(total / limit),
          per_page: parseInt(limit.toString()),
          total_items: total,
        },
      };
    } catch (err) {
      throw new InternalServerErrorException('somethings went wrong');
    }
  }

  async createHsn(createHsnDto: CreateHsnDto): Promise<ResponseDto<null>> {
    try {
      const gst: GST = await this.findGstById(createHsnDto.gst_id);
      const newhsn: HSN = this._hsnRespository.create({
        hsn_code: createHsnDto.hsn_code,
        hsn_desc: createHsnDto.hsn_desc,
        hsn_type: createHsnDto.hsn_type,
        gst,
      });
      const respone = await this._hsnRespository.save(newhsn);

      if (respone) {
        return {
          message: 'Hsn create sucessfully',
          response: null,
        };
      }
    } catch (err) {
      if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
        throw new ConflictException('Duplicate entry hsn code already exists');
      }
      throw new InternalServerErrorException('somethings went wrong');
    }
  }

  async updateHsn(updateHsnDto: UpdateHsnDto): Promise<ResponseDto<null>> {
    const hsn: HSN = await this.findHsnById(updateHsnDto.id);
    hsn.hsn_code = updateHsnDto.hsn_code;
    hsn.hsn_desc = updateHsnDto.hsn_desc;
    hsn.hsn_type = updateHsnDto.hsn_type;
    hsn.gst = await this.findGstById(updateHsnDto.gst_id);
    hsn.isActive = 1;
    try {
      const respone = await this._hsnRespository.save(hsn);
      if (respone) {
        return {
          message: 'Hsn updated sucessfully',
          response: null,
        };
      }
    } catch (err) {
      if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
        throw new ConflictException('Duplicate entry hsn code already exists');
      }
      throw new InternalServerErrorException('somethings went wrong');
    }
  }

  async removeHsn(id: number): Promise<ResponseDto<null>> {
    const hsn = await this.findHsnById(id);

    if (hsn) {
      const result = await this._hsnRespository.save({
        id,
        isActive: 0,
      });

      if (result) {
        return {
          message: 'Hsn removed sucessfully',
          response: null,
        };
      }
    } else {
      throw new NotFoundException("hsn dosn't exist");
    }
  }

  async findGstById(id: number): Promise<GST> {
    const gst: GST = await this._gstRespository.findOne({
      where: {
        id,
        isActive: 1,
      },
    });

    if (gst) {
      return gst;
    }

    throw new NotFoundException(`gst with id ${id} not found`);
  }

  async findHsnById(id: number): Promise<HSN> {
    const hsn: HSN = await this._hsnRespository.findOne({
      where: {
        id,
        isActive: 1,
      },
    });

    if (hsn) {
      return hsn;
    }

    throw new NotFoundException(`hsn with id ${id} not found`);
  }
}
