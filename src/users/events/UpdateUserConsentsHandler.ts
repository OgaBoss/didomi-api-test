import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateUserConsentsEvents } from './UpdateUserConsentsEvents';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/User';
import { Consent } from '../../consents/models/Consent';

@EventsHandler(UpdateUserConsentsEvents)
export class UpdateUserConsentsHandler
  implements IEventHandler<UpdateUserConsentsEvents>
{
  constructor(
    @InjectRepository(Consent)
    private readonly consentsRepository: Repository<Consent>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async handle(event: UpdateUserConsentsEvents) {
    const { user_id, version, consents } = event;

    const user = await this.userRepository.findOne(user_id, {
      relations: ['consent'],
    });
    if (user.consent) {
      user.consent.data = consents;
      user.consent.version_id = version;
      await this.consentsRepository.save(user.consent);
      return;
    }

    const consent = new Consent();
    consent.version_id = version;
    consent.data = consents;
    consent.user = user;

    await this.consentsRepository.save(consent);
  }
}
