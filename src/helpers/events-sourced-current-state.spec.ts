import { Repository } from 'typeorm';
import { User } from '../users/models/User';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventSourcedCurrentState } from './EventSourcedCurrentState';
import { Event } from '../events/models/Event';
import { EventTypes } from '../events/dtos/EventTypes';

describe('EventSourcedCurrentState', () => {
  let repository: Repository<Event>;
  let helper: EventSourcedCurrentState;

  // Create user instance
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
      version: 1,
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
        EventSourcedCurrentState,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue(events),
            })),
          },
        },
      ],
    }).compile();

    repository = module.get<Repository<Event>>(getRepositoryToken(Event));
    helper = module.get(EventSourcedCurrentState);
  });

  it('get current events action state', async () => {
    const response = await helper.getEventsCurrentStates(user.id);
    expect(repository.createQueryBuilder).toBeCalledTimes(1);
    expect(response.length).toBe(2);
    expect(response[0].enabled).toBeTruthy();
  });
});
