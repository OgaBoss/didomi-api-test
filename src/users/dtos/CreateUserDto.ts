import { IsEmail } from 'class-validator';
import { EmailExists } from '../../validation/Decorators/EmailExists';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @EmailExists()
  @ApiProperty({ description: 'Email of user to create' })
  email: string;
}
