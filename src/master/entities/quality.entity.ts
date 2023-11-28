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
import { YarnType } from './yarn-type.entity';

@Entity({ name: 'quality' })
export class Quality {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
    length: 30,
  })
  quality_desc: string;

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

  @ManyToOne((type) => YarnType, (type) => type.id, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'type_id',
    referencedColumnName: 'id',
  })
  type: YarnType;
}
