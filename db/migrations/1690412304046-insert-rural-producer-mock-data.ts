import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertRuralProducerMockData1690412304046 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "farm"("id","name", "city", "state", "total_area", "arable_area", "vegetation_area") VALUES (1, 'Vila Rica','Rio de Janeiro','RJ',100,50,20);`);
        await queryRunner.query(`INSERT INTO "farm_planting_cultures_planting_culture"("farm_id", "planting_culture_id") VALUES (1,4);`);
        await queryRunner.query(`INSERT INTO "farm_planting_cultures_planting_culture"("farm_id", "planting_culture_id") VALUES (1,5);`);
        await queryRunner.query(`INSERT INTO "rural_producer"("name", "cpf_cnpj", "farm_id") VALUES ('Mateus Moraes','08241989644',1);`);

        await queryRunner.query(`INSERT INTO "farm"("id","name", "city", "state", "total_area", "arable_area", "vegetation_area") VALUES (2, 'Vila Madalena','Belo Horizonte','MG',300,100,150);`);
        await queryRunner.query(`INSERT INTO "farm_planting_cultures_planting_culture"("farm_id", "planting_culture_id") VALUES (2,1);`);
        await queryRunner.query(`INSERT INTO "farm_planting_cultures_planting_culture"("farm_id", "planting_culture_id") VALUES (2,2);`);
        await queryRunner.query(`INSERT INTO "rural_producer"("name", "cpf_cnpj", "farm_id") VALUES ('Marcos Vinícios','28534418063',2);`);

        await queryRunner.query(`INSERT INTO "farm"("id","name", "city", "state", "total_area", "arable_area", "vegetation_area") VALUES (3, 'Fazenda São Bento','Belo Horizonte','MG',1050,1000,10);`);
        await queryRunner.query(`INSERT INTO "farm_planting_cultures_planting_culture"("farm_id", "planting_culture_id") VALUES (3,1);`);
        await queryRunner.query(`INSERT INTO "farm_planting_cultures_planting_culture"("farm_id", "planting_culture_id") VALUES (3,2);`);
        await queryRunner.query(`INSERT INTO "farm_planting_cultures_planting_culture"("farm_id", "planting_culture_id") VALUES (3,3);`);
        await queryRunner.query(`INSERT INTO "farm_planting_cultures_planting_culture"("farm_id", "planting_culture_id") VALUES (3,4);`);
        await queryRunner.query(`INSERT INTO "rural_producer"("name", "cpf_cnpj", "farm_id") VALUES ('Bento José','32504290071',3);`);

        await queryRunner.query(`INSERT INTO "farm"("id","name", "city", "state", "total_area", "arable_area", "vegetation_area") VALUES (4, 'Fazenda Boa Esperança','Belo Horizonte','MG',600,100,450);`);
        await queryRunner.query(`INSERT INTO "farm_planting_cultures_planting_culture"("farm_id", "planting_culture_id") VALUES (4,3);`);
        await queryRunner.query(`INSERT INTO "farm_planting_cultures_planting_culture"("farm_id", "planting_culture_id") VALUES (4,4);`);
        await queryRunner.query(`INSERT INTO "rural_producer"("name", "cpf_cnpj", "farm_id") VALUES ('José Gonçanves','83250351024',4);`);

        await queryRunner.query(`INSERT INTO "farm"("id","name", "city", "state", "total_area", "arable_area", "vegetation_area") VALUES (5, 'Fazenda Nova','Belo Horizonte','MG',600,100,450);`);
        await queryRunner.query(`INSERT INTO "farm_planting_cultures_planting_culture"("farm_id", "planting_culture_id") VALUES (5,5);`);
        await queryRunner.query(`INSERT INTO "rural_producer"("name", "cpf_cnpj", "farm_id") VALUES ('Rafael Medeiros','25531348002',5);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM farm_planting_cultures_planting_culture;`);
        await queryRunner.query(`DELETE FROM rural_producer;`);
        await queryRunner.query(`DELETE FROM farm;`);
    }

}
