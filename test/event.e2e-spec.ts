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
import { User } from '../src/users/models/User';
import { useContainer } from 'class-validator';
import { Event } from '../src/events/models/Event';
import { CreateEventDto } from '../src/events/dtos/CreateEventDto';
import { EventTypes } from '../src/events/dtos/EventTypes';
import { EventsModule } from '../src/events/events.module';

describe('[Events Users] /events', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  const createUserDto: CreateUserDto = { email: 'test@test.com' };
  const createEventsDto: CreateEventDto = {
    user: {
      id: '',
    },
    consents: [
      {
        id: EventTypes.SMS_NOTIFICATIONS,
        enabled: false,
      },
      {
        id: EventTypes.EMAIL_NOTIFICATIONS,
        enabled: true,
      },
    ],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        EventsModule,
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

  it('create new events [POST /events]', async () => {
    const { body } = await request(httpServer)
      .post('/users')
      .send(createUserDto);

    createEventsDto.user.id = body.id;
    return request(httpServer)
      .post('/events')
      .send(createEventsDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body.email).toBe('test@test.com');
        expect(body.consents.length).toBe(2);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
