import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConsentsDataInterface } from '../common/dtos/ConsentsDataInterface';
import { Event } from '../events/models/Event';
import { EventTypes } from '../events/dtos/EventTypes';

export class EventSourcedCurrentState {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  async getEventsCurrentStates(
    user_id: string,
  ): Promise<ConsentsDataInterface[]> {
    // Get all events ordered by version, ASC
    const events = await this.eventsRepository
      .createQueryBuilder('events')
      .where('events.user_id = :user_id', {
        user_id: user_id,
      })
      .orderBy('version', 'ASC')
      .getMany();

    // Create defaults notification states
    let sms_notification: boolean | null = null;
    let email_notification: boolean | null = null;

    events
      .map((item) => {
        return item.data;
      })
      .flat(2)
      .forEach((item: ConsentsDataInterface) => {
        if (item.id === EventTypes.EMAIL_NOTIFICATIONS) {
          email_notification = item.enabled;
        }

        if (item.id === EventTypes.SMS_NOTIFICATIONS) {
          sms_notification = item.enabled;
        }
      });

    const consents: ConsentsDataInterface[] = [];

    if (sms_notification !== null) {
      consents.push({
        id: EventTypes.SMS_NOTIFICATIONS,
        enabled: sms_notification,
      });
    }

    if (email_notification !== null) {
      consents.push({
        id: EventTypes.EMAIL_NOTIFICATIONS,
        enabled: email_notification,
      });
    }

    return consents;
  }
}
