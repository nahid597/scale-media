import { IDbConfig } from './type';

export const dbConfig: IDbConfig = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'scalemedia_user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'scalemedia',
};
