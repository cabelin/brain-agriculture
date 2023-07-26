import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("plating_culture")
export class PlantingCultureEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

}
