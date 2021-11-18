import { ConsentsDataInterface } from '../../common/dtos/ConsentsDataInterface';
import { ArrayNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ValidateNested()
  @ArrayNotEmpty()
  @Type(() => ConsentsDataInterface)
  @ApiProperty({ description: 'User consents actions' })
  consents: ConsentsDataInterface[];

  @IsObject()
  @ApiProperty({
    description: 'User',
    properties: { id: { description: 'User uuid' } },
  })
  user: {
    id: string;
  };
}
