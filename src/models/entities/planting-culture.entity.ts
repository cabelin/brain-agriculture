import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("planting_culture")
export class PlantingCultureEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

}
