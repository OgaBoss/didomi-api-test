import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/models/User';
import { ConsentsDataInterface } from '../../common/dtos/ConsentsDataInterface';

@Entity({ name: 'consents' })
export class Consent {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('jsonb')
  data: ConsentsDataInterface[];

  @Column()
  version_id: number;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
