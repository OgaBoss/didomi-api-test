import { registerDecorator, ValidationOptions } from 'class-validator';
import { EmailExistsRule } from '../Rules/EmailExistsRule';

export function EmailExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'UserExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: EmailExistsRule,
    });
  };
}
