import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'color' })
export class Color {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 3,
    unique: true,
    nullable: false,
  })
  color_code: string;

  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
    nullable: false,
  })
  color_desc: string;

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
