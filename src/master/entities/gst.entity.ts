import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'gst' })
export class GST {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 30,
        unique: true,
        nullable: false
    })
    gst_desc: string;

    @Column({
        type: 'float',
        nullable: false
    })
    gst_rate: number;

    @Column({
        type: 'float',
        nullable: false
    })
    igst: number;

    @Column({
        type: 'float',
        nullable: false
    })
    sgst: number;

    @Column({
        type: 'float',
        nullable: false
    })
    cgst: number;

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
