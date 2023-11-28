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
import { YarnType } from '../entities/yarn-type.entity';
import { CreateYarnTypeDto } from './dto/create-yarn-type.dto';
import { UpdateYarnTypeDto } from './dto/update-yarn-type.dto';

@Injectable()
export class YarnTypeService {
  constructor(
    @InjectRepository(YarnType)
    private _yarnTypeRepository: Repository<YarnType>,
  ) {}

  async findAllYarnType(
    search: string = null,
  ): Promise<ResponseDto<YarnType[]>> {
    try {
      const query = this._yarnTypeRepository
        .createQueryBuilder('yarn_type')
        .where('yarn_type.isActive = 1');

      if (search) {
        query.andWhere('LOWER(yarn_type.type_desc) like LOWER(:search)', {
          search: `%${search}%`,
        });
      }

      const data: YarnType[] = await query
        .addOrderBy('yarn_type.id', 'ASC')
        .getMany();

      return {
        message:
          data.length == 0 ? 'No data found.' : 'data found sucessfully.',
        response: data,
      };
    } catch (err) {
      throw new InternalServerErrorException('somethings went wrong');
    }
  }

  async paginateYarnType(
    page: number = 1,
    limit: number = PerPageLimit,
    search: string = null,
  ): Promise<ResponseDto<YarnType[]>> {
    try {
      let data: YarnType[], total: number;

      const query = this._yarnTypeRepository
        .createQueryBuilder('yarn_type')
        .where('yarn_type.isActive = 1');

      if (search) {
        page = 1;
        query.where('LOWER(yarn_type.type_desc) like LOWER(:search)', {
          search: `%${search}%`,
        });
      }

      if (page == -1) {
        [data, total] = await query.getManyAndCount();
      } else {
        const skip = (page - 1) * limit;
        [data, total] = await query
          .addOrderBy('yarn_type.id', 'DESC')
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

  async createYarnType(
    createYarnTypeDto: CreateYarnTypeDto,
  ): Promise<ResponseDto<null>> {
    try {
      const newYarnType: YarnType = this._yarnTypeRepository.create({
        type_desc: createYarnTypeDto.type_desc,
        type: createYarnTypeDto.type,
        count_type: createYarnTypeDto.count_type,
      });
      const respone = await this._yarnTypeRepository.save(newYarnType);

      if (respone) {
        return {
          message: 'Yarn type create sucessfully',
          response: null,
        };
      }
    } catch (err) {
      if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
        throw new ConflictException(
          'Duplicate entry yarn description or type already exists',
        );
      }
      throw new InternalServerErrorException('somethings went wrong');
    }
  }

  async updateYarnType(
    updateYarnTypeDto: UpdateYarnTypeDto,
  ): Promise<ResponseDto<null>> {
    const yarnType: YarnType = await this.findYarnTypeById(
      updateYarnTypeDto.id,
    );
    yarnType.type_desc = updateYarnTypeDto.type_desc;
    yarnType.count_type = updateYarnTypeDto.count_type;
    yarnType.type = updateYarnTypeDto.type;
    yarnType.isActive = 1;
    try {
      const respone = await this._yarnTypeRepository.save(yarnType);
      if (respone) {
        return {
          message: 'Yarn type updated sucessfully',
          response: null,
        };
      }
    } catch (err) {
      if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
        throw new ConflictException(
          'Duplicate entry yarn description or type already exists',
        );
      }
      throw new InternalServerErrorException('somethings went wrong');
    }
  }

  async removeYarnType(id: number): Promise<ResponseDto<null>> {
    const yarnType = await this._yarnTypeRepository.findOne({
      where: {
        id,
      },
    });

    if (yarnType) {
      const result = await this._yarnTypeRepository.save({
        id,
        isActive: 0,
      });

      if (result) {
        return {
          message: 'Yarn removed sucessfully',
          response: null,
        };
      }
    } else {
      throw new NotFoundException("yarn type dosn't exist");
    }
  }

  async findYarnTypeById(id: number): Promise<YarnType> {
    const yarnType: YarnType = await this._yarnTypeRepository.findOne({
      where: { id },
    });

    if (yarnType) {
      return yarnType;
    }

    throw new NotFoundException(`yarn type with id ${id} not found`);
  }
}
