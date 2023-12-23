import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Color } from './color.entity';
import { HSN } from './hsn.entity';
import { Quality } from './quality.entity';
import { YarnGroup } from './yarn-group.entity';
import { YarnType } from './yarn-type.entity';

export enum YarnGryDyeEnum {
  GREY = 1,
  DYED = 2,
}

@Entity({ name: 'yarn_master' })
export class YarnMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'yarn_code',
    type: 'varchar',
    length: 13,
    unique: true,
    nullable: false,
  })
  yarn_code: string;

  @Column({
    name: 'yarn_desc',
    type: 'varchar',
    length: 60,
    unique: true,
    nullable: false,
  })
  yarn_desc: string;

  @ManyToOne(() => YarnType, (yarn_type) => yarn_type.id, { nullable: false })
  @JoinColumn({
    name: 'yarn_type_id',
    referencedColumnName: 'id',
  })
  yarn_type: YarnType;

  @Column({
    name: 'ply',
    type: 'int',
    nullable: false,
  })
  ply: number;

  @Column({
    name: 'rate',
    type: 'float',
    nullable: false,
  })
  rate: number;

  @Column({
    name: 'count',
    type: 'float',
    nullable: false,
  })
  count: number;

  @Column({
    name: 'eng_count',
    type: 'float',
    nullable: false,
  })
  eng_count: number;

  @Column({
    name: 'denier',
    type: 'float',
    nullable: false,
  })
  denier: number;

  @ManyToOne(() => Quality, (qly) => qly.id, { nullable: false })
  @JoinColumn({
    name: 'qly_id',
    referencedColumnName: 'id',
  })
  quality: Quality;

  @Column({
    name: 'twist',
    type: 'varchar',
    length: 1,
    nullable: false,
  })
  twist: string;

  @ManyToOne(() => Color, (color) => color.id, { nullable: false })
  @JoinColumn({
    name: 'color_id',
    referencedColumnName: 'id',
  })
  color: Color;

  @Column({
    name: 'gryOrDey',
    type: 'enum',
    enum: YarnGryDyeEnum,
    nullable: false,
  })
  gryOrDey: YarnGryDyeEnum;

  @ManyToOne(() => Category, (category) => category.id, { nullable: false })
  @JoinColumn({
    name: 'ctgr_id',
    referencedColumnName: 'id',
  })
  category: Category;

  @ManyToOne(() => YarnGroup, (yarnGroup) => yarnGroup.id, { nullable: false })
  @JoinColumn({
    name: 'group_id',
    referencedColumnName: 'id',
  })
  group: YarnGroup;

  @ManyToOne(() => HSN, (hsn) => hsn.id, { nullable: false })
  @JoinColumn({
    name: 'hsn_id',
    referencedColumnName: 'id',
  })
  hsn: HSN;

  @Exclude()
  @Column({
    type: 'int',
    default: 1,
  })
  isActive: number;

  @Exclude()
  @CreateDateColumn()
  created_at: Date; // Creation date

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
}
