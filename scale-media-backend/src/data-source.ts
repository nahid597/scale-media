import { DataSource } from 'typeorm';
import { dbConfig } from './app/config/database.config';

export const AppDataSource = new DataSource({
  ...dbConfig,
  entities: ['src/app/modules/**/infrastructure/*.orm-entity.ts'],
  migrations: ['src/app/database/migration/*.ts'],
  synchronize: false,
  logging: true,
});

// Initialize and run migrations
AppDataSource.initialize()
  .then(async () => {
    console.log('Data Source has been initialized!');
    await AppDataSource.runMigrations();
    console.log('Migrations have been run successfully!');
    await AppDataSource.destroy();
    process.exit(0);
  })
  .catch(error => {
    console.error('Error during migration:', error);
    process.exit(1);
  });
