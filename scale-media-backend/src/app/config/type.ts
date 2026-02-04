export interface IDbConfig {
  type: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mongodb';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}
