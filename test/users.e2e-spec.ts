import {
  HttpServer,
  INestApplication,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CreateUserDto } from '../src/users/dtos/CreateUserDto';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import { UsersModule } from '../src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfig } from '../src/db/db-config';

describe('[API Users] /users', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  const createUserDto: CreateUserDto = { email: 'test@test.com' };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, TypeOrmModule.forRoot(DbConfig.dbOptions())],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
    httpServer = app.getHttpServer();
  });

  it('create user [POST /users]', () => {
    return request(httpServer)
      .post('/users')
      .send(createUserDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        console.log(body);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
