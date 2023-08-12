import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_profile' })
export class UserProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'first_name',
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    first_name: string;

    @Column({
        name: 'middle_name',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    middle_name: string;

    @Column({
        name: 'last_name',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    last_name: string;

    @Column({
        name: 'avatar',
        type: 'varchar',
        nullable: true,
    })
    avatar: string;

    //Address Details
    @Column({
        type: 'varchar',
        length: 300,
        nullable: true,
    })
    address1: string;

    @Column({
        type: 'int',
        nullable: true,
    })
    country_id: number;

    @Column({
        type: 'varchar',
        length: 60,
        nullable: true,
    })
    city: string;

    @Column({
        type: 'int',
        nullable: true,
    })
    state_id: number;

    @Column({
        type: 'bigint',
        width: 6,
        nullable: true,
    })
    pinCode: number;

    @Column({
        type: 'varchar',
        length: 200,
        unique: true,
        nullable: true,
    })
    email: string;

    //Contact Details
    @Column({
        type: 'bigint',
        width: 10,
        nullable: true,
    })
    mobile1: number;


    @Column({
        type: 'bigint',
        width: 10,
        nullable: true,
    })
    mobile2: number;

    @OneToOne(() => User, (user) => user.profile)
    user: User;

    @Exclude()
    @Column({
        type: 'int',
        default: 1
    })
    isActive: number;

    @Exclude()
    @CreateDateColumn()
    created_at: Date; // Creation date

    @Exclude()
    @UpdateDateColumn()
    updated_at: Date; // Last updated date 

}
