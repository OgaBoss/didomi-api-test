import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { CommandBus } from '@nestjs/cqrs';
import { CreateEventDto } from './dtos/CreateEventDto';
import { EventTypes } from './dtos/EventTypes';
import { CreateEventCommand } from './commands/CreateEventCommand';

describe('EventsService', () => {
  let service: EventsService;
  let commandBusMock: CommandBus;
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
      providers: [
        EventsService,
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    commandBusMock = module.get(CommandBus);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('it should execute command', async () => {
    await service.createEvents(createEventsDto);
    expect(commandBusMock.execute).toHaveBeenCalledWith(
      new CreateEventCommand(createEventsDto),
    );
    expect(commandBusMock.execute).toBeCalledTimes(1);
  });

  afterEach(() => {
    (commandBusMock.execute as jest.Mock).mockClear();
  });
});
