import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StateMaster } from '../entities/state-master.entity';
import { Repository } from 'typeorm';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { CreateStateDto } from '../dto/create-state.dto';
import { ER_DUP_ENTRY, ER_DUP_ENTRY_NO } from 'src/shared/constant/error.const';

@Injectable()
export class StatesMasterService {
  /**
   * Constructor for the StateMasterService.
   *
   * @param _stateMasterRepository The StateMaster repository provided by TypeORM.
   */
  constructor(
    @InjectRepository(StateMaster)
    private _stateMasterRepository: Repository<StateMaster>,
  ) {}

  /**
   * Retrieves a list of all active states.
   *
   * @returns A ResponseDto containing an array of StateMaster objects and a message.
   */
  async getAllStateList(): Promise<ResponseDto<StateMaster[]>> {
    const query = this._stateMasterRepository
      .createQueryBuilder('state')
      .where('state.isActive = 1')
      .orderBy('state.id', 'ASC');

    const data = await query.getMany();

    return {
      message: data.length ? 'Data found successfully.' : 'No data found.',
      response: data,
    };
  }

  /**
   * Adds a new state to the StateMaster table.
   *
   * @param createStateDto The data needed to create a new StateMaster object.
   * @returns A ResponseDto with a message indicating success or failure and null for the response.
   * @throws ConflictException if a duplicate state already exists.
   * @throws InternalServerErrorException for any other errors.
   */
  async addNewState(
    createStateDto: CreateStateDto,
  ): Promise<ResponseDto<null>> {
    try {
      const newState: StateMaster = this._stateMasterRepository.create({
        name: createStateDto.name,
        state_cd: createStateDto.state_cd,
        vehicle_code: createStateDto.vehicle_code,
        srl_no: createStateDto.srl_no,
        gst_stcd: createStateDto.gst_stcd,
        type: createStateDto.type,
      });

      const response = await this._stateMasterRepository.save(newState);

      if (response) {
        return {
          message: 'State created successfully.',
          response: null,
        };
      }
    } catch (err) {
      if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
        throw new ConflictException('Duplicate entry, state already exists.');
      }
      throw new InternalServerErrorException('somethings went wrong');
    }
  }
}
