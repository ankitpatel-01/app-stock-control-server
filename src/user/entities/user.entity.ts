import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
        name: 'full_name',
        type: 'varchar',
        length: 60,
        default: null
    })
    full_name: string;

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
}
