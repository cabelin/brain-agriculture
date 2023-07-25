import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("rural_producer")
export class RuralProducerEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ name: "cpf_cnpj", unique: true })
    cpfOrCnpj: string;

}
