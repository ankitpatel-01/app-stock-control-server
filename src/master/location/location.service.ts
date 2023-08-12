import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataFound, NoDataFound, PerPageLimit } from 'src/shared/constant/constant';
import { ER_DUP_ENTRY, ER_DUP_ENTRY_NO } from 'src/shared/constant/error.const';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {

    constructor(
        @InjectRepository(Location)
        private _locationRepository: Repository<Location>) { }

    async getAllLocation(search: string = null): Promise<ResponseDto<Location[]>> {
        try {
            const query = this._locationRepository.createQueryBuilder('location')
                .where("location.isActive = 1");

            if (search) {
                query.andWhere('LOWER(location.location_name) like LOWER(:search)', { search: `%${search}%` })
                    .orWhere('LOWER(location.factory_name) like LOWER(:search)', { search: `%${search}%` });
            }

            const data: Location[] = await query.getMany();

            return {
                message: data.length == 0 ? NoDataFound : DataFound,
                response: data,
            };

        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    async paginateLocation(
        page: number = 1,
        limit: number = PerPageLimit,
        search: string = null,
    ): Promise<ResponseDto<Location[]>> {
        try {
            let data: Location[], total: number;

            const query = this._locationRepository.createQueryBuilder('location').where("location.isActive = 1");

            if (search) {
                page = 1;
                query.where('LOWER(location.location_name) like LOWER(:search)', { search: `%${search}%` })
                    .orWhere('LOWER(location.factory_name) like LOWER(:search)', { search: `%${search}%` });
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
                }
            };

        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    async createLocation(createLocationDto: CreateLocationDto, userId: number): Promise<ResponseDto<null>> {

        const existingLocation: Location = await this.findLocationByName(createLocationDto.location_name);
        if (existingLocation) {
            if (existingLocation.isActive) {
                throw new ConflictException("Duplicate entry Location code already exists");
            } else {
                existingLocation.isActive = 1;
                existingLocation.factory_city = createLocationDto.factory_city;
                existingLocation.factory_name = createLocationDto.factory_name;
                const respone = await this._locationRepository.save(existingLocation);
                if (respone) {
                    return {
                        message: "new location create sucessfully",
                        response: null,
                    }
                }
            }

        } else {
            try {
                const newLocation: Location = await this._locationRepository.create({
                    location_name: createLocationDto.location_name,
                    factory_name: createLocationDto.factory_name,
                    factory_city: createLocationDto.factory_city,
                });
                const respone = await this._locationRepository.save(newLocation);

                if (respone) {
                    return {
                        message: "new location create sucessfully",
                        response: null,
                    }
                }
            } catch (err) {
                if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
                    throw new ConflictException("Duplicate entry location already exists")
                }
                throw new InternalServerErrorException(err)
            }
        }
    }

    async updateLocation(updateLocationDto: UpdateLocationDto, userId: number): Promise<ResponseDto<null>> {
        const location: Location = await this.findLocationById(updateLocationDto.id);
        location.factory_city = updateLocationDto.factory_city;
        location.factory_name = updateLocationDto.factory_name;
        location.location_name = updateLocationDto.location_name;
        location.isActive = 1;
        try {
            const respone = await this._locationRepository.save(location);
            if (respone) {
                return {
                    message: "location updated sucessfully",
                    response: null
                }
            }
        } catch (err) {
            if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
                throw new ConflictException("Duplicate entry location already exists")
            }
            throw new InternalServerErrorException(err)
        }
    }

    async removeLocation(id: number, userId: number): Promise<ResponseDto<null>> {

        const location = await this.findLocationById(id)

        if (location) {
            const result = await this._locationRepository.save({
                id,
                isActive: 0
            })

            if (result) {
                return {
                    message: "Location removed sucessfully",
                    response: null,
                }
            }
        } else {
            throw new NotFoundException("Location doesn't exist");
        }
    }

    async findLocationById(id: number): Promise<Location> {
        const location = await this._locationRepository.findOne({
            where: {
                id,
                isActive: 1
            }
        })

        if (location) {
            return location;
        }

        throw new NotFoundException(`location with id ${id} not found`);
    }

    async findLocationByName(name: string): Promise<Location> {
        return await this._locationRepository.findOne({
            where: {
                location_name: name,
            }
        })
    }

}
