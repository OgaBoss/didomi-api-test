import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateEventCommand } from './CreateEventCommand';
import { Event } from '../models/Event';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Consent } from '../../consents/models/Consent';
import { ConsentsDataInterface } from '../../common/dtos/ConsentsDataInterface';
import { EventTypes } from '../dtos/EventTypes';
import { User } from '../../users/models/User';
import { CreateEventDto } from '../dtos/CreateEventDto';

@CommandHandler(CreateEventCommand)
export class CreateEventHandler implements ICommandHandler<CreateEventCommand> {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Consent)
    private readonly consentsRepository: Repository<Consent>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly connection: Connection,
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
      await CreateEventHandler.saveEventAction(
        user,
        createEventDto,
        eventVersion,
        queryRunner,
      );

      // Save current notification state to consents projections
      const consents = await this.dispatchUserConsentsEvent(
        user,
        createEventDto,
        eventVersion,
      );

      // Commit Transaction
      await queryRunner.commitTransaction();

      // Return user with new consents
      return {
        id: user.id,
        email: user.email,
        consents: consents.data,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private static async saveEventAction(
    user: User,
    createEventDto: CreateEventDto,
    eventVersion: number,
    queryRunner: QueryRunner,
  ) {
    const events = new Event();
    events.user = user;
    events.data = createEventDto.consents;
    events.version = eventVersion;

    // Events Saved
    await queryRunner.manager.save(events);
  }

  private async dispatchUserConsentsEvent(
    user: User,
    createEventDto: CreateEventDto,
    eventVersion: number,
  ) {
    // Get Notification current state
    const { smsNotification, emailNotification } =
      this.getNotificationCurrentState(createEventDto);

    const userConsents = await this.consentsRepository
      .createQueryBuilder('consents')
      .where('consents.user_id = :user_id', {
        user_id: createEventDto.user.id,
      })
      .getOne();

    const consents: ConsentsDataInterface[] =
      userConsents && userConsents.data
        ? userConsents.data
        : createEventDto.consents;

    if (userConsents && smsNotification !== null) {
      consents.forEach((item) => {
        if (item.id === EventTypes.SMS_NOTIFICATIONS) {
          item.enabled = smsNotification;
        }
      });
    }

    if (userConsents && emailNotification !== null) {
      consents.forEach((item) => {
        if (item.id === EventTypes.EMAIL_NOTIFICATIONS) {
          item.enabled = emailNotification;
        }
      });
    }

    if (userConsents) {
      userConsents.version_id = eventVersion;
      userConsents.data = consents;

      return this.consentsRepository.save(userConsents);
    }

    const consent = new Consent();
    consent.version_id = eventVersion;
    consent.data = consents;
    consent.user = user;

    return await this.consentsRepository.save(consent);
  }

  private getNotificationCurrentState(createEventDto: CreateEventDto) {
    let smsNotification: null | boolean = null;
    let emailNotification: null | boolean = null;

    // loop through payload.consents to get the current state of users consents
    createEventDto.consents.forEach((item: ConsentsDataInterface) => {
      if (item.id === EventTypes.EMAIL_NOTIFICATIONS) {
        emailNotification = item.enabled;
      }

      if (item.id === EventTypes.SMS_NOTIFICATIONS) {
        smsNotification = item.enabled;
      }
    });
    return { smsNotification, emailNotification };
  }
}
