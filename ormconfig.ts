import * as dotenv from 'dotenv';
import { AppEnvironment } from 'src/modules/shared/enums/app-environment.enum';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();
const config: DataSourceOptions = {
  type: 'mysql',
  host: process.env[AppEnvironment.DB_STUART_HOST],
  port: 3306,
  password: process.env[AppEnvironment.DB_STUART_PASS],
  database:
    process.env['CREATE_DB'] === 'true'
      ? 'master'
      : process.env[AppEnvironment.DB_STUART_NAME],

  username: process.env[AppEnvironment.DB_STUART_USER],
  synchronize: false,
  logging: true,
  migrations: ['./src/modules/shared/database/migrations/*{.ts,.js}'],
};

export default new DataSource(config);
