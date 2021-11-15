import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/models/User';
import { JoinColumn } from 'typeorm/browser';
import { ConsentsDataInterface } from '../../common/dtos/ConsentsDataInterface';

@Entity({ name: 'consents' })
export class Consent {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  data: ConsentsDataInterface[];

  @Column()
  version_id: number;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
