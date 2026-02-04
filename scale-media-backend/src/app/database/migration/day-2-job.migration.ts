import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateJobTableDay21738728000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`jobs\` (
        \`id\` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        \`fileKey\` VARCHAR(255) NOT NULL,
        \`status\` ENUM('pending', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'pending',
        \`progress\` INT NOT NULL DEFAULT 0,
        \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`jobs\``);
  }
}
