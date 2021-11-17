import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { CreateEventDto } from './dtos/CreateEventDto';
import { EventTypes } from './dtos/EventTypes';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;
  const eventResponse = {
    id: 'a35254fc-94d3-4557-ade1-a305aba7bef4',
    email: 'dami@yahoo.com',
    consents: [
      {
        id: 'email_notifications',
        enabled: true,
      },
      {
        id: 'sms_notifications',
        enabled: false,
      },
    ],
  };
  const createEventsDto: CreateEventDto = {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: {
            createEvents: jest.fn().mockReturnValue(eventResponse),
          },
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('post method should create new events', async () => {
    const response = await controller.store(createEventsDto);
    expect(typeof response).toBe('object');
    expect(service.createEvents).toBeCalledTimes(1);
    expect(service.createEvents).toBeCalledWith(createEventsDto);
    expect(response?.id).toBe(eventResponse.id);
  });
});
