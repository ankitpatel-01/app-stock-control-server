import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { StatesMasterService } from './states-master.service';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { StateMaster } from '../entities/state-master.entity';
import { CreateStateDto } from '../dto/create-state.dto';
import { Public } from 'src/common/decorator';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('misc/states-master')
@ApiTags('Miscellaneous Master')
@ApiSecurity('access-key')
export class StatesMasterController {
  constructor(private _statesMasterService: StatesMasterService) {}

  @ApiResponse({
    status: 200,
    description: 'List of states',
    type: StateMaster,
    isArray: true,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Public()
  @Get('')
  getYarnType(): Promise<ResponseDto<StateMaster[]>> {
    return this._statesMasterService.getAllStateList();
  }

  @Post('create')
  createYarnType(
    @Body() createStateDto: CreateStateDto,
  ): Promise<ResponseDto<null>> {
    return this._statesMasterService.addNewState(createStateDto);
  }
}
