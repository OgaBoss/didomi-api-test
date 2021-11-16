import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../users/models/User';
import { InjectRepository } from '@nestjs/typeorm';

@ValidatorConstraint({ name: 'EmailExist', async: true })
@Injectable()
export class EmailExistsRule implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async validate(value: string) {
    try {
      const response = await this.userRepository
        .createQueryBuilder('users')
        .where('users.email = :email', { email: value })
        .getOne();
      return !response;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `The email ${validationArguments.value} already exists`;
  }
}
