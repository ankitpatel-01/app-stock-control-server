import { Exclude } from "class-transformer";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'location' })
export class Location {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    location_name: string;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    factory_name: string;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    factory_city: string;

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

    @ManyToOne(type => User, user => user.id)
    @JoinColumn()
    user: User;

}
