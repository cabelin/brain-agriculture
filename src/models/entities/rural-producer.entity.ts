import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FarmEntity } from "./farm.entity";

@Entity("rural_producer")
export class RuralProducerEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ name: "cpf_cnpj", unique: true })
    cpfOrCnpj: string;

    @OneToOne(() => FarmEntity, { cascade: false })
    @JoinColumn({
        name: 'farm_id',
        referencedColumnName: 'id'
    })
    farm: FarmEntity;

}
