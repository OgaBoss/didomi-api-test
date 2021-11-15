import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/models/User';
import { JoinColumn } from 'typeorm/browser';
import { ConsentsDataInterface } from '../../common/dtos/ConsentsDataInterface';

@Entity({ name: 'events' })
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  version: number;

  @Column({ type: 'jsonb' })
  data: ConsentsDataInterface[];

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
