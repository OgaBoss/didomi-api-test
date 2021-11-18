import {
  HttpServer,
  INestApplication,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CreateUserDto } from '../src/users/dtos/CreateUserDto';
import { UsersModule } from '../src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../src/users/models/User';

describe('[API Users] /users', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  const createUserDto: CreateUserDto = { email: 'test@test.com' };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: '127.0.0.1',
          port: 3306,
          username: 'root',
          password: null,
          database: 'didomi_test',
          entities: [User],
          autoLoadEntities: true,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [Repository],
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
