import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    let dbConfig = {};
    switch (process.env.NODE_ENV) {
      case 'development':
        Object.assign(dbConfig, {
          type: this.config.get('DB_TYPE'),
          database: this.config.get('DB_NAME'),
          synchronize: this.config.get('SYNCHRONIZE'),
          autoLoadEntities: true,
        });
        break;
      case 'test':
        Object.assign(dbConfig, {
          type: this.config.get('DB_TYPE'),
          database: this.config.get('DB_NAME'),
          synchronize: this.config.get('SYNCHRONIZE'),
          autoLoadEntities: true,
          migrationsRun: this.config.get('MIGRATIONS_RUN'),
        });
        break;
      case 'production':
        Object.assign(dbConfig, {
          type: this.config.get('DB_TYPE'),
          url: process.env.DATABASE_URL,
          autoLoadEntities: true,
          migrationsRun: this.config.get('MIGRATIONS_RUN'),
          synchronize: this.config.get('SYNCHRONIZE'),
          ssl: {
            rejectUnauthorized: this.config.get('SSL'),
          },
        });
        break;
      default:
        throw new Error('Unknown environment');
    }
    return dbConfig;
  }
}
