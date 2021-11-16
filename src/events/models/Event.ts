import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/models/User';
import { JoinColumn } from 'typeorm';
import { ConsentsDataInterface } from '../../common/dtos/ConsentsDataInterface';

@Entity({ name: 'events' })
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  version: number;

  @Column('jsonb')
  data: ConsentsDataInterface[];

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
