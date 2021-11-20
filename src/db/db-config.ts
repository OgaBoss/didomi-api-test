import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/models/User';
import { Event } from '../events/models/Event';

export class DbConfig {
  static dbOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      entities: [User, Event],
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: false,
    };
  }
}
