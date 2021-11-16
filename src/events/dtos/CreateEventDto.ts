import { ConsentsDataInterface } from '../../common/dtos/ConsentsDataInterface';
import { ArrayNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @ValidateNested()
  @ArrayNotEmpty()
  @Type(() => ConsentsDataInterface)
  consents: ConsentsDataInterface[];

  @IsObject()
  user: {
    id: string;
  };
}
