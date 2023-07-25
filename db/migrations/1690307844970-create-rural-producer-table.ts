import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRuralProducerTable1690307844970 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rural_producer" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "cpf_cnpj" character varying NOT NULL, CONSTRAINT "PK_ID" PRIMARY KEY ("id"), CONSTRAINT "UC_RURAL_PRODUCER" UNIQUE (cpf_cnpj))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "rural_producer"`);
    }

}
