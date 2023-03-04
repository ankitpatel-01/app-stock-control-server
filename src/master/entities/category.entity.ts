import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'category' })
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 40,
        unique: true,
        nullable: false,
    })
    category_desc: string;

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
