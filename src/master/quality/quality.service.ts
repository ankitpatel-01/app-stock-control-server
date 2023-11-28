import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataFound,
  NoDataFound,
  PerPageLimit,
} from 'src/shared/constant/constant';
import { ER_DUP_ENTRY, ER_DUP_ENTRY_NO } from 'src/shared/constant/error.const';
import { ResponseDto } from 'src/shared/dto/response.dto';

import { Repository } from 'typeorm';
import { Quality } from '../entities/quality.entity';
import { YarnType } from '../entities/yarn-type.entity';
import { CreateQualityDto } from './dto/create-quality.dto';
import { UpdateQualityDto } from './dto/update-quality.dto';

@Injectable()
export class QualityService {
  constructor(
    @InjectRepository(Quality)
    private _qualityRespository: Repository<Quality>,
    @InjectRepository(YarnType)
    private _YarnTypeRespository: Repository<YarnType>,
  ) {}

  async getAllQuality(search: string = null): Promise<ResponseDto<Quality[]>> {
    try {
      const query = this._qualityRespository
        .createQueryBuilder('q')
        .leftJoinAndSelect('q.type', 'type')
        .where('q.isActive = 1')
        .andWhere('type.isActive = 1');

      if (search) {
        query.andWhere('LOWER(q.quality_desc) like LOWER(:search)', {
          search: `%${search}%`,
        });
      }

      const data: Quality[] = await query.orderBy('q.id', 'DESC').getMany();

      return {
        message: data.length === 0 ? NoDataFound : DataFound,
        response: data,
      };
    } catch (err) {
      throw new InternalServerErrorException('somethings went wrong');
    }
  }

  async paginateQuality(
    page: number = 1,
    limit: number = PerPageLimit,
    search: string = null,
  ): Promise<ResponseDto<Quality[]>> {
    try {
      let data: Quality[], total: number;

      const query = this._qualityRespository
        .createQueryBuilder('q')
        .leftJoinAndSelect('q.type', 'type')
        .where('q.isActive = 1')
        .andWhere('type.isActive = 1');

      if (search) {
        query.andWhere('LOWER(q.quality_desc) like LOWER(:search)', {
          search: `%${search}%`,
        });
      }

      if (page == -1) {
        [data, total] = await query.orderBy('q.id', 'DESC').getManyAndCount();
      } else {
        const skip = (page - 1) * limit;
        [data, total] = await query
          .orderBy('q.id', 'DESC')
          .take(limit)
          .skip(skip)
          .getManyAndCount();
      }

      return {
        message: data.length == 0 ? NoDataFound : DataFound,
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

  async createQuality(
    createQualityDto: CreateQualityDto,
  ): Promise<ResponseDto<null>> {
    const type: YarnType = await this.findTypeById(createQualityDto.type);
    try {
      const newQuality: Quality = this._qualityRespository.create({
        quality_desc: createQualityDto.quality_desc,
        type,
      });
      const respone = await this._qualityRespository.save(newQuality);

      if (respone) {
        return {
          message: 'New quality create sucessfully',
          response: null,
        };
      }
    } catch (err) {
      if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
        throw new ConflictException('Duplicate entry quality already exists');
      }
      throw new InternalServerErrorException('somethings went wrong');
    }
  }

  async updatedQuality(
    upadateQualityDto: UpdateQualityDto,
  ): Promise<ResponseDto<null>> {
    const quality: Quality = await this.findQualityById(upadateQualityDto.id);
    quality.quality_desc = upadateQualityDto.quality_desc;
    quality.type = await this.findTypeById(upadateQualityDto.type);
    quality.isActive = 1;
    try {
      const respone = await this._qualityRespository.save(quality);

      if (respone) {
        return {
          message: 'quality updated sucessfully',
          response: null,
        };
      }
    } catch (err) {
      if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
        throw new ConflictException('Duplicate entry quality already exists');
      }
      throw new InternalServerErrorException('somethings went wrong');
    }
  }

  async removeQuality(id: number): Promise<ResponseDto<null>> {
    const yarnType = await this.findQualityById(id);

    if (yarnType) {
      const result = await this._qualityRespository.save({
        id,
        isActive: 0,
      });

      if (result) {
        return {
          message: 'Quality removed sucessfully',
          response: null,
        };
      }
    }
  }

  async findTypeById(id: number): Promise<YarnType> {
    const type: YarnType = await this._YarnTypeRespository.findOne({
      where: {
        id,
        isActive: 1,
      },
    });

    if (type) {
      return type;
    }

    throw new NotFoundException(`yarn type with id ${id} not found`);
  }

  async findQualityById(id: number): Promise<Quality> {
    const quality: Quality = await this._qualityRespository.findOne({
      where: {
        id,
        isActive: 1,
      },
    });

    if (quality) {
      return quality;
    }

    throw new NotFoundException(`quality with id ${id} not found`);
  }
}
