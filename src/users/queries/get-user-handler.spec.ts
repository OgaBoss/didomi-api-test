import { Repository } from 'typeorm';
import { User } from '../models/User';
import { EventSourcedCurrentState } from '../../helpers/EventSourcedCurrentState';
import { Test, TestingModule } from '@nestjs/testing';
import { GetUserHandler } from './GetUserHandler';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GetUserQuery } from './GetUserQuery';

describe('GetUserHandler', () => {
  let repository: Repository<User>;
  let handler: GetUserHandler;
  let service: EventSourcedCurrentState;
  const user = {
    id: 'a35254fc-94d3-4557-ade1-a305aba7bef4',
    email: 'dami@yahoo.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserHandler,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(user),
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
    handler = module.get(GetUserHandler);
    service = module.get<EventSourcedCurrentState>(EventSourcedCurrentState);
  });

  it('should return 1 instance of a user', async () => {
    const user_id = '39af21a5-3920-44de-9d8c-3ccced178d60';

    const response = await handler.execute(new GetUserQuery(user_id));

    expect(repository.findOne).toBeCalledWith(user_id);
    expect(repository.findOne).toBeCalledTimes(1);
    expect(response.consents.length).toBe(2);
    expect(service.getEventsCurrentStates).toBeCalledTimes(1);
  });

  it('should return not found exception if user does not exist', async () => {
    const user_id = '39af21a5-3920-44de-9d8c-3ccced178d60';

    try {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await handler.execute(new GetUserQuery(user_id));
    } catch (e) {
      expect(e.message).toBe(`User with id #${user_id} not found`);
    }
  });
});
