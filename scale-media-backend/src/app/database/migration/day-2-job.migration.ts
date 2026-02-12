import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateJobTableDay21738728000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`jobs\` (
        \`id\` VARCHAR(255) PRIMARY KEY,
        \`uploadId\` VARCHAR(255) NOT NULL,
        \`userId\` VARCHAR(255) NOT NULL,
        \`fileKey\` VARCHAR(255) NOT NULL,
        \`status\` ENUM('pending', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'pending',
        \`progress\` INT NOT NULL DEFAULT 0,
        \`metadata\` JSON,
        \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`jobs\``);
  }
}
