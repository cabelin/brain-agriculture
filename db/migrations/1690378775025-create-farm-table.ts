import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFarmTable1690378775025 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "farm" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "total_area" integer NOT NULL, "arable_area" integer NOT NULL, "vegetation_area" integer NOT NULL, CONSTRAINT "PK_FARM_ID" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "rural_producer" ADD "farm_id" integer`);
        await queryRunner.query(`ALTER TABLE "rural_producer" ADD CONSTRAINT "UQ_FARM_ID" UNIQUE ("farm_id")`);
        await queryRunner.query(`ALTER TABLE "rural_producer" ADD CONSTRAINT "FK_FARM_ID" FOREIGN KEY ("farm_id") REFERENCES "farm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rural_producer" DROP CONSTRAINT "FK_FARM_ID"`);
        await queryRunner.query(`ALTER TABLE "rural_producer" DROP CONSTRAINT "UQ_FARM_ID"`);
        await queryRunner.query(`ALTER TABLE "rural_producer" DROP COLUMN "farm_id"`);
        await queryRunner.query(`DROP TABLE "farm"`);
    }

}
