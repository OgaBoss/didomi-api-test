import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { Consent } from '../../consents/models/Consent';
import { ConsentsDataInterface } from '../../common/dtos/ConsentsDataInterface';
import { AggregateRoot } from '@nestjs/cqrs';
import { UpdateUserConsentsEvents } from '../events/UpdateUserConsentsEvents';

@Entity({ name: 'users' })
export class User extends AggregateRoot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @IsEmail()
  @Column()
  email: string;

  @CreateDateColumn({ default: () => 'NOW()' })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'NOW()' })
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @OneToOne(() => Consent, (consent) => consent.user)
  consent: Consent;

  setConsents(
    user_id: string,
    version: number,
    consents: ConsentsDataInterface[],
  ) {
    this.apply(new UpdateUserConsentsEvents(user_id, version, consents));
  }
}
