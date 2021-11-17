import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { AggregateRoot } from '@nestjs/cqrs';

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
}
