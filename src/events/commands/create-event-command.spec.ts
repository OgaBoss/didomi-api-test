import { CreateEventCommand } from './CreateEventCommand';
import { CreateEventDto } from '../dtos/CreateEventDto';
import { EventTypes } from '../dtos/EventTypes';

describe('CreateEventCommand', () => {
  it('should create a CreateEventCommand instance', () => {
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
    const command = new CreateEventCommand(createEventDto);
    expect(command.createEventDto.user.id).toBe(createEventDto.user.id);
    expect(command.createEventDto.consents.length).toBe(2);
  });
});
