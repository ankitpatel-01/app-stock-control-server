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
import { GST } from './gst.entity';

export enum HsnType {
  HSN = 1,
  SERVICE = 2,
}

@Entity({ name: 'hsn' })
export class HSN {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    width: 6,
    nullable: false,
    unique: true,
  })
  hsn_code: number;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  hsn_desc: string;

  @Column({
    type: 'enum',
    enum: HsnType,
    nullable: false,
  })
  hsn_type: HsnType;

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

  @ManyToOne(() => GST, (gst) => gst.id, { nullable: false })
  @JoinColumn({
    name: 'gst_id',
    referencedColumnName: 'id',
  })
  gst: GST;
}
