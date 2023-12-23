import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'yarn_type' })
export class YarnType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 40,
    unique: true,
    nullable: false,
  })
  type_desc: string;

  @Column({
    type: 'varchar',
    length: 1,
    unique: true,
    nullable: false,
  })
  type: string;

  @Column({
    type: 'varchar',
    length: 1,
    nullable: false,
  })
  count_type: string;

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
