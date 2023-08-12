import { Exclude } from 'class-transformer';
import { Company } from 'src/company/entities/company-master.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { UserProfile } from './user-profile.entity';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'name',
        type: 'varchar',
        length: 30,
        nullable: false,
    })
    name: string;

    @Column({
        name: 'username',
        type: 'varchar',
        length: 50,
        unique: true,
        nullable: false,
    })
    username: string;

    @Exclude()
    @Column({
        name: 'password',
        type: 'varchar',
        length: 150,
        nullable: false,
    })
    password: string;

    @Exclude()
    @Column({
        name: 'hashdRt',
        type: 'varchar',
        length: 150,
        default: null
    })
    hashdRt: string | null;

    @Exclude()
    @Column({
        type: 'int',
        default: 1
    })
    isActive: number;

    @ManyToOne(() => Company, company => company.users)
    @JoinColumn({ name: "company_id" })
    company: Company;

    @OneToOne(() => UserProfile, { cascade: true })
    @JoinColumn({ name: "profile_id" })
    profile: UserProfile;


    @Exclude()
    @CreateDateColumn()
    created_at: Date; // Creation date

    @Exclude()
    @UpdateDateColumn()
    updated_at: Date; // Last updated date 
}
