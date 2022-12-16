import { Logger } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

require('dotenv').config();

export class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  isDevelopment() {
    return this.getValue('NODE_ENV', false) === 'development';
  }

  getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.getValue('DATABASE_HOST'),
      port: Number.parseInt(this.getValue('DATABASE_PORT'), 10),
      username: this.getValue('DATABASE_USERNAME'),
      password: this.getValue('DATABASE_PASSWORD'),
      database: this.getValue('DATABASE_DATABASE'),
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrationsTableName: 'migrations',
      migrations: ['src/migration/*.ts'],
      cli: {
        migrationsDir: 'src/migration',
      },
      synchronize: false,
      logging: false,
    };
  }
}
