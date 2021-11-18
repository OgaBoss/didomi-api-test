import { Connection, Repository } from 'typeorm';
import { Event } from '../models/Event';
import { User } from '../../users/models/User';
import { EventSourcedCurrentState } from '../../helpers/EventSourcedCurrentState';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateEventHandler } from './CreateEventHandler';
import { EventTypes } from '../dtos/EventTypes';
import { CreateEventCommand } from './CreateEventCommand';
import { CreateEventDto } from '../dtos/CreateEventDto';

describe('CreateEventHandler', () => {
  let eventRepository: Repository<Event>;
  let userRepository: Repository<User>;
  let helper: EventSourcedCurrentState;
  let handler: CreateEventHandler;
  const createEventDto: CreateEventDto = {
    user: {
      id: 'a35254fc-94d3-4557-ade1-a305aba7bef4',
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

  const user = new User();
  user.id = 'a35254fc-94d3-4557-ade1-a305aba7bef4';
  user.email = 'test@test.com';

  const events: Event[] = [
    {
      id: 'ea987682-e19f-4841-9ca0-63367f401e85',
      user,
      version: 1,
      created_at: new Date(),
      data: [
        {
          id: EventTypes.EMAIL_NOTIFICATIONS,
          enabled: false,
        },
        {
          id: EventTypes.SMS_NOTIFICATIONS,
          enabled: true,
        },
      ],
    },
    {
      id: 'ea987682-e19f-4841-9ca0-63367f401e85',
      user,
      version: 2,
      created_at: new Date(),
      data: [
        {
          id: EventTypes.EMAIL_NOTIFICATIONS,
          enabled: false,
        },
        {
          id: EventTypes.SMS_NOTIFICATIONS,
          enabled: false,
        },
      ],
    },
    {
      id: 'ea987682-e19f-4841-9ca0-63367f401e85',
      user,
      version: 1,
      created_at: new Date(),
      data: [
        {
          id: EventTypes.EMAIL_NOTIFICATIONS,
          enabled: true,
        },
        {
          id: EventTypes.SMS_NOTIFICATIONS,
          enabled: true,
        },
      ],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEventHandler,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(user),
          },
        },
        {
          provide: EventSourcedCurrentState,
          useValue: {
            getEventsCurrentStates: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Event),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(events[1]),
              getMany: jest.fn().mockResolvedValue(events),
            })),
          },
        },
        {
          provide: Connection,
          useValue: {
            createQueryRunner: jest.fn(() => ({
              connect: jest.fn().mockReturnThis(),
              startTransaction: jest.fn().mockReturnThis(),
              commitTransaction: jest.fn().mockReturnThis(),
              rollbackTransaction: jest.fn().mockReturnThis(),
              release: jest.fn().mockReturnThis(),
              manager: {
                save: jest.fn().mockReturnThis(),
              },
            })),
          },
        },
      ],
    }).compile();

    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    helper = module.get(EventSourcedCurrentState);
    handler = module.get(CreateEventHandler);
  });

  it('saved new event action', async () => {
    await handler.execute(new CreateEventCommand(createEventDto));

    expect(userRepository.findOne).toBeCalledTimes(1);
    expect(eventRepository.createQueryBuilder).toBeCalledTimes(1);
    expect(helper.getEventsCurrentStates).toBeCalledTimes(1);
  });
});
