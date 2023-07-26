import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePlantingCultureTable1690393892950 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "planting_culture" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_4688be2bdf76a9730a1674fff49" UNIQUE ("name"), CONSTRAINT "PK_PLANTING_CULTURE_ID" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "farm_planting_cultures_planting_culture" ("farm_id" integer NOT NULL, "planting_culture_id" integer NOT NULL, CONSTRAINT "PK_FARM_PLANTING_CULTURE_ID" PRIMARY KEY ("farm_id", "planting_culture_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_FARM_ID" ON "farm_planting_cultures_planting_culture" ("farm_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_PLANTING_CULTURE_ID" ON "farm_planting_cultures_planting_culture" ("planting_culture_id") `);
        await queryRunner.query(`ALTER TABLE "farm_planting_cultures_planting_culture" ADD CONSTRAINT "FK_FARM_ID" FOREIGN KEY ("farm_id") REFERENCES "farm"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "farm_planting_cultures_planting_culture" ADD CONSTRAINT "FK_PLANTING_CULTURE_ID" FOREIGN KEY ("planting_culture_id") REFERENCES "planting_culture"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "farm_planting_cultures_planting_culture" DROP CONSTRAINT "FK_PLANTING_CULTURE_ID"`);
        await queryRunner.query(`ALTER TABLE "farm_planting_cultures_planting_culture" DROP CONSTRAINT "FK_FARM_ID"`);
        await queryRunner.query(`ALTER TABLE "rural_producer" DROP CONSTRAINT "FK_FARM_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_PLANTING_CULTURE_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_FARM_ID"`);
        await queryRunner.query(`DROP TABLE "farm_planting_cultures_planting_culture"`);
        await queryRunner.query(`DROP TABLE "planting_culture"`);
        await queryRunner.query(`ALTER TABLE "rural_producer" ADD CONSTRAINT "FK_FARM_ID" FOREIGN KEY ("farm_id") REFERENCES "farm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
