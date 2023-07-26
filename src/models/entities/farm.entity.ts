import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("farm")
export class FarmEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column({ name: "total_area" })
    totalArea: number;

    @Column({ name: "arable_area" })
    arableArea: number;

    @Column({ name: "vegetation_area" })
    vegetationArea: number;

}
