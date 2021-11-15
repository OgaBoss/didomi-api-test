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

@Entity({ name: 'users' })
export class User {
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

  @OneToOne(() => Consent, (consent) => consent.data)
  consent: ConsentsDataInterface[];
}
