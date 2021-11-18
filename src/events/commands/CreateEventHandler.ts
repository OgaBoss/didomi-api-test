import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateEventCommand } from './CreateEventCommand';
import { Event } from '../models/Event';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/models/User';
import { EventSourcedCurrentState } from '../../helpers/EventSourcedCurrentState';

@CommandHandler(CreateEventCommand)
export class CreateEventHandler implements ICommandHandler<CreateEventCommand> {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly connection: Connection,
    private readonly service: EventSourcedCurrentState,
  ) {}

  async execute(command: CreateEventCommand) {
    const { createEventDto } = command;

    // Start a transaction
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Get User
      const user = await this.userRepository.findOne(createEventDto.user.id);
      let eventVersion = 0;

      // Get the current event version for this user from the consents table
      const lastEventAction = await this.eventRepository
        .createQueryBuilder('events')
        .where('events.user_id = :user_id', {
          user_id: createEventDto.user.id,
        })
        .orderBy('version', 'DESC')
        .limit(1)
        .getOne();

      if (lastEventAction) {
        eventVersion = lastEventAction.version;
      }

      // increment version by 1
      eventVersion++;

      // Save payload to events store
      const events = new Event();
      events.user = user;
      events.data = createEventDto.consents;
      events.version = eventVersion;

      // Events Saved
      await queryRunner.manager.save(events);

      // Commit Transaction
      await queryRunner.commitTransaction();

      // Return user with new consents
      return {
        id: user.id,
        email: user.email,
        consents: await this.service.getEventsCurrentStates(user.id),
      };
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
