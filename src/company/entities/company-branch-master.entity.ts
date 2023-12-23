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
import { Company } from './company-master.entity';

@Entity({ name: 'compnay_branch_master' })
export class CompanyBranch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  //Address Details

  @Column({
    type: 'varchar',
    length: 300,
    nullable: false,
  })
  address1: string;

  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  address2: string;

  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  address3: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  country_id: number;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  city: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  state_id: number;

  @Column({
    type: 'bigint',
    width: 6,
    nullable: false,
  })
  pinCode: number;

  //Contact Details
  @Column({
    type: 'bigint',
    width: 10,
    nullable: false,
  })
  mobile1: number;

  @Column({
    type: 'bigint',
    width: 10,
    nullable: true,
  })
  mobile2: number;

  @Column({
    type: 'bigint',
    width: 10,
    nullable: true,
  })
  tel_no: number;

  @Column({
    type: 'bigint',
    width: 10,
    nullable: true,
  })
  fax_no: number;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  website: string;

  //Taxation Details
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  gst_no: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  cin_no: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  pan_no: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  opening_date: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  from_date: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  to_date: string;

  //Bank Details
  @Column({
    type: 'bigint',
    nullable: false,
  })
  account_no: number;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: false,
  })
  ifsc_code: string;

  @Column({
    type: 'varchar',
    length: 80,
    nullable: false,
  })
  bank_branch_name: string;

  @Column({
    type: 'varchar',
    length: 80,
    nullable: false,
  })
  bank_name: string;

  @ManyToOne(() => Company, (company) => company.company_branches)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Exclude()
  @CreateDateColumn()
  created_at: Date; // Creation date

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @Exclude()
  @Column({
    type: 'int',
    default: 1,
  })
  isActive: number;
}
