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
import { Unit } from '../entities/unit.entity';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(Unit)
    private _unitRepository: Repository<Unit>,
  ) {}

  async getAllUnit(search: string = null): Promise<ResponseDto<Unit[]>> {
    try {
      const query = this._unitRepository
        .createQueryBuilder('unit')
        .where('unit.isActive = 1');

      if (search) {
        query
          .andWhere('LOWER(unit.unit_name) like LOWER(:search)', {
            search: `%${search}%`,
          })
          .orWhere('LOWER(unit.unit_desc) like LOWER(:search)', {
            search: `%${search}%`,
          });
      }

      const data: Unit[] = await query.getMany();

      return {
        message: data.length == 0 ? NoDataFound : DataFound,
        response: data,
      };
    } catch (err) {
      throw new InternalServerErrorException('somethings went wrong');
    }
  }

  async paginateUnit(
    page: number = 1,
    limit: number = PerPageLimit,
    search: string = null,
  ): Promise<ResponseDto<Unit[]>> {
    try {
      let data: Unit[], total: number;

      const query = this._unitRepository
        .createQueryBuilder('unit')
        .where('unit.isActive = 1');

      if (search) {
        page = 1;
        query
          .where('LOWER(unit.unit_desc) like LOWER(:search)', {
            search: `%${search}%`,
          })
          .orWhere('LOWER(unit.unit_name) like LOWER(:search)', {
            search: `%${search}%`,
          });
      }

      if (page == -1) {
        [data, total] = await query.getManyAndCount();
      } else {
        const skip = (page - 1) * limit;
        [data, total] = await query.take(limit).skip(skip).getManyAndCount();
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

  async createUnit(
    createUnitDto: CreateUnitDto,
    userId: number,
  ): Promise<ResponseDto<null>> {
    const existingUnit = await this.findUnitByName(createUnitDto.unit_name);

    if (existingUnit) {
      return await this.updateExistingUnit(existingUnit, createUnitDto);
    } else {
      return await this.createNewUnit(createUnitDto);
    }
  }

  private async updateExistingUnit(
    existingUnit: Unit,
    createUnitDto: CreateUnitDto,
  ): Promise<ResponseDto<null>> {
    if (existingUnit.isActive) {
      throw new ConflictException('Duplicate entry unit code already exists');
    } else {
      existingUnit.isActive = 1;
      existingUnit.unit_name = createUnitDto.unit_name;
      existingUnit.unit_desc = createUnitDto.unit_desc;
      const response = await this._unitRepository.save(existingUnit);

      if (response) {
        return {
          message: 'New unit created successfully',
          response: null,
        };
      }
    }
  }

  private async createNewUnit(
    createUnitDto: CreateUnitDto,
  ): Promise<ResponseDto<null>> {
    try {
      const newUnit = this._unitRepository.create({
        unit_name: createUnitDto.unit_name,
        unit_desc: createUnitDto.unit_desc,
      });

      const response = await this._unitRepository.save(newUnit);

      if (response) {
        return {
          message: 'New unit created successfully',
          response: null,
        };
      }
    } catch (err) {
      if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
        throw new ConflictException(
          'Duplicate entry unit description or code already exists',
        );
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async updateUnit(
    updateUnitDto: UpdateUnitDto,
    userId: number,
  ): Promise<ResponseDto<null>> {
    const unit: Unit = await this.findUnitById(updateUnitDto.id);
    unit.unit_desc = updateUnitDto.unit_desc;
    unit.unit_name = updateUnitDto.unit_name;
    unit.isActive = 1;
    try {
      const respone = await this._unitRepository.save(unit);
      if (respone) {
        return {
          message: 'unit updated sucessfully',
          response: null,
        };
      }
    } catch (err) {
      if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
        throw new ConflictException(
          'Duplicate entry unit description or code already exists',
        );
      }
      throw new InternalServerErrorException('somethings went wrong');
    }
  }

  async removeUnit(id: number, userId: number): Promise<ResponseDto<null>> {
    const unit = await this.findUnitById(id);

    if (unit) {
      const result = await this._unitRepository.save({
        id,
        isActive: 0,
      });

      if (result) {
        return {
          message: 'Unit removed sucessfully',
          response: null,
        };
      }
    } else {
      throw new NotFoundException("Unit doesn't exist");
    }
  }

  async findUnitById(id: number): Promise<Unit> {
    const unit = await this._unitRepository.findOne({
      where: {
        id,
        isActive: 1,
      },
    });

    if (unit) {
      return unit;
    }

    throw new NotFoundException(`unit with id ${id} not found`);
  }

  async findUnitByName(name: string): Promise<Unit> {
    return await this._unitRepository.findOne({
      where: {
        unit_name: name,
      },
    });
  }
}
