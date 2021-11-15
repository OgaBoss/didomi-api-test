export enum EventTypes {
  SMS_NOTIFICATIONS = 'sms_notifications',
  EMAIL_NOTIFICATIONS = 'email_notifications',
}

export interface ConsentsDataInterface {
  id: EventTypes;
  enabled: boolean;
}
