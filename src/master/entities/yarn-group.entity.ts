import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'yarn_group' })
export class YarnGroup {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 40,
        unique: true,
        nullable: false,
    })
    yarn_grp_name: string;

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
