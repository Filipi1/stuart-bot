import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { join } from 'path';
import { AppEnvironment } from 'src/modules/shared/enums/app-environment.enum';

@Injectable()
export class TypeormConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(AppEnvironment.DB_STUART_HOST)
    private readonly dbHost: string,
    @Inject(AppEnvironment.DB_STUART_USER)
    private readonly dbUser: string,
    @Inject(AppEnvironment.DB_STUART_PASS)
    private readonly dbPass: string,
    @Inject(AppEnvironment.DB_STUART_NAME)
    private readonly dbName: string,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {    
    return {
      type: 'mysql',
      host: this.dbHost,
      username: this.dbUser,
      password: this.dbPass,
      database: this.dbName,
      port: 3306,
      entities: [join(__dirname, '../../../../**/*.entity{.ts,.js}')],
      migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
      synchronize: true,
    };
  }
}
