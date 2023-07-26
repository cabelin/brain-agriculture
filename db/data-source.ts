import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvExpand.expand(dotenv.config());

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  entities: ['dist/src/models/**/*.entity.js'],
  migrations: ["dist/db/migrations/*.js"],
  synchronize: false,
};

const typeOrmModuleOptions: TypeOrmModuleOptions = {
  ...dataSourceOptions,
  host: "db",
  logging: Boolean(process.env.LOGGING)
};

const dataSource: DataSource = new DataSource(dataSourceOptions);

export { typeOrmModuleOptions };

export default dataSource;
