import { EventTypes } from '../../events/dtos/EventTypes';
import { IsBoolean, IsString } from 'class-validator';

export class ConsentsDataInterface {
  @IsString()
  id: EventTypes;

  @IsBoolean()
  enabled: boolean;
}
