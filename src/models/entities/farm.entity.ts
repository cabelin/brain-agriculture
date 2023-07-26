import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { PlantingCultureEntity } from "./culture.entity";

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

    @ManyToMany(() => PlantingCultureEntity)
    @JoinTable()
    platingCultures: PlantingCultureEntity[];

}
