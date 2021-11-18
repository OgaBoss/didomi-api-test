import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export class DbConfig {
  static dbOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: false,
    };
  }
}

// database:
//   process.env.NODE_ENV === 'development'
//     ? process.env.DB_DATABASE
//     : process.env.DB_DATABASE_TEST,
//     autoLoadEntities: true,
//   synchronize: process.env.NODE_ENV !== 'development',
