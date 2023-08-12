import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Quality } from './entities/quality.entity';
import { YarnType } from './entities/yarn-type.entity';
import { QualityController } from './quality/quality.controller';
import { QualityService } from './quality/quality.service';
import { YarnTypeController } from './yarn-type/yarn-type.controller';
import { YarnTypeService } from './yarn-type/yarn-type.service';
import { ColorController } from './color/color.controller';
import { ColorService } from './color/color.service';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { Color } from './entities/color.entity';
import { Category } from './entities/category.entity';
import { YarnGroupController } from './yarn-group/yarn-group.controller';
import { YarnGroupService } from './yarn-group/yarn-group.service';
import { YarnGroup } from './entities/yarn-group.entity';
import { HsnController } from './hsn/hsn.controller';
import { HsnService } from './hsn/hsn.service';
import { GstService } from './gst/gst.service';
import { GstController } from './gst/gst.controller';
import { HSN } from './entities/hsn.entity';
import { GST } from './entities/gst.entity';
import { YarnMasterController } from './yarn-master/yarn-master.controller';
import { YarnMasterService } from './yarn-master/yarn-master.service';
import { YarnMaster } from './entities/yarn.entity';
import { Unit } from './entities/unit.entity';
import { Location } from './entities/location.entity';
import { UnitController } from './unit/unit.controller';
import { LocationController } from './location/location.controller';
import { UserModule } from 'src/user/user.module';
import { LocationService } from './location/location.service';
import { UnitService } from './unit/unit.service';
import { ItemGroupController } from './item-group/item-group.controller';
import { ItemGroupService } from './item-group/item-group.service';
import { ItemGroup } from './entities/item-group.entity';

const EntityList: EntityClassOrSchema[] = [
  YarnType,
  Quality,
  Color,
  Category,
  YarnGroup,
  GST,
  HSN,
  YarnMaster,
  Unit,
  Location,
  ItemGroup,
]

@Module({
  imports: [TypeOrmModule.forFeature(EntityList), UserModule],
  controllers: [
    YarnTypeController,
    QualityController,
    ColorController,
    CategoryController,
    YarnGroupController,
    HsnController,
    GstController,
    YarnMasterController,
    UnitController,
    LocationController,
    ItemGroupController,
  ],
  providers: [
    YarnTypeService,
    QualityService,
    ColorService,
    CategoryService,
    YarnGroupService,
    HsnService,
    GstService,
    YarnMasterService,
    UnitService,
    LocationService,
    ItemGroupService,
  ]
})
export class MasterModule { }
