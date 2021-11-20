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
import { getRepository, Repository } from 'typeorm';
import { User } from '../src/users/models/User';
import { useContainer } from 'class-validator';
import { Event } from '../src/events/models/Event';

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
          entities: [User, Event],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [Repository],
    }).compile();

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
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
        expect(body.email).toBe('test@test.com');
        expect(body.consents.length).toBe(0);
      });
  });

  it('should get user [GET /users/:id]', async () => {
    const user = await getRepository(User).find();

    return request(httpServer)
      .get(`/users/${user[0].id}`)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.email).toBe('test@test.com');
        expect(body.consents.length).toBe(0);
      });
  });

  it('should get all users [GET /users]', async () => {
    return request(httpServer)
      .get(`/users`)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBeTruthy();
      });
  });

  it('should delete a user [DELETE /users/:id]', async () => {
    const user = await getRepository(User).find();

    return request(httpServer)
      .delete(`/users/${user[0].id}`)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.message).toBe(
          `User with id #${user[0].id} successfully removed`,
        );
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
