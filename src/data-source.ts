import { DataSource, DataSourceOptions } from 'typeorm';

export const appDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  entities: ['**/*.entity{.ts,.js}'],
  migrations: [__dirname, '/migrations/*{.js,.ts}'],
} as DataSourceOptions);
