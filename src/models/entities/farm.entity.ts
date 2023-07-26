import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { PlantingCultureEntity } from "./planting-culture.entity";

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

    @ManyToMany(() => PlantingCultureEntity, { cascade: true })
    @JoinTable({
        name: 'farm_planting_cultures_planting_culture',
        joinColumn: {
          name: 'farm_id',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'planting_culture_id',
          referencedColumnName: 'id',
        },
      })
    plantingCultures: PlantingCultureEntity[];

}
