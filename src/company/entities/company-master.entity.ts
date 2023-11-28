import { User } from 'src/user/entities/user.entity';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompanyType } from './company-type.entity';
import { CompanyBranch } from './company-branch-master.entity';

@Entity({ name: 'compnay_master' })
export class Company {
  @PrimaryGeneratedColumn()
  company_id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  company_name: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  company_short_name: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  trading_name: string;

  @ManyToOne(() => CompanyType, (comType) => comType.id, { nullable: false })
  @JoinColumn({
    name: 'type_id',
    referencedColumnName: 'id',
  })
  company_type: CompanyType;

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
    unique: true,
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
    unique: true,
    nullable: false,
  })
  gst_no: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  cin_no: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
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

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => CompanyBranch, (branch) => branch.company)
  company_branches: CompanyBranch[];

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
