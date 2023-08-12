import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { CompanyType } from './entities/company-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Company } from './entities/company-master.entity';
import { CompanyBranch } from './entities/company-branch-master.entity';


const EntityList: EntityClassOrSchema[] = [
  CompanyType,
  Company,
  CompanyBranch,
]

@Module({
  imports: [TypeOrmModule.forFeature(EntityList), UserModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService]
})
export class CompanyModule { }
