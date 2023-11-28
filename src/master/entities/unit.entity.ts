import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'unit' })
export class Unit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 10,
    unique: true,
    nullable: false,
  })
  unit_name: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  unit_desc: string;

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
