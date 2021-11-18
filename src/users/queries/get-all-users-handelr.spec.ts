import { Repository } from 'typeorm';
import { User } from '../models/User';
import { GetAllUsersHandler } from './GetAllUsersHandler';
import { EventSourcedCurrentState } from '../../helpers/EventSourcedCurrentState';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaginationQueryDto } from '../../common/dtos/PaginationQueryDto';
import { GetAllUsersQuery } from './GetAllUsersQuery';

describe('GetAllUsersHandler', () => {
  let repository: Repository<User>;
  let handler: GetAllUsersHandler;
  let service: EventSourcedCurrentState;
  const users = [
    {
      id: 'a35254fc-94d3-4557-ade1-a305aba7bef4',
      email: 'dami@yahoo.com',
    },
    {
      id: '39af21a5-3920-44de-9d8c-3ccced178d60',
      email: 'dami+23@yahoo.com',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllUsersHandler,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue(users),
          },
        },
        {
          provide: EventSourcedCurrentState,
          useValue: {
            getEventsCurrentStates: jest.fn().mockResolvedValue([
              {
                id: 'sms_notifications',
                enabled: false,
              },
              {
                id: 'email_notifications',
                enabled: true,
              },
            ]),
          },
        },
      ],
    }).compile();

    repository = module.get<Repository<User>>(getRepositoryToken(User));
    handler = module.get(GetAllUsersHandler);
    service = module.get<EventSourcedCurrentState>(EventSourcedCurrentState);
  });

  it('gets all users', async () => {
    const params: PaginationQueryDto = {
      limit: 1,
      offset: 0,
    };
    const response = await handler.execute(new GetAllUsersQuery(params));
    expect(response.length).toBe(2);
    expect(response[0].consents.length).toBe(2);
    expect(repository.find).toBeCalledTimes(1);
    expect(service.getEventsCurrentStates).toBeCalledTimes(2);
  });
});
