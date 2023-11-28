import { Module } from '@nestjs/common';
import { StatesMasterController } from './states-master/states-master.controller';
import { StatesMasterService } from './states-master/states-master.service';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { StateMaster } from './entities/state-master.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

const EntityList: EntityClassOrSchema[] = [StateMaster];

@Module({
  imports: [TypeOrmModule.forFeature(EntityList)],
  controllers: [StatesMasterController],
  providers: [StatesMasterService],
})
export class MiscModule {}
