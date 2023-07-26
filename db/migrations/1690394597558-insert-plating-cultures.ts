import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertPlantingCultures1690394597558 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO planting_culture (name)
            VALUES
                ('Soja'),
                ('Milho'),
                ('Algodão'),
                ('Café'),
                ('Cana de açucar');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM planting_culture;`);
    }

}
