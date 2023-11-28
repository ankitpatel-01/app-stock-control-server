import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'states_master' })
export class StateMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  state_cd: string;

  @Column()
  name: string;

  @Column({ type: 'int' })
  srl_no: number;

  @Column()
  type: string;

  @Column()
  vehicle_code: string;

  @Column({ type: 'int' })
  gst_stcd: number;

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
