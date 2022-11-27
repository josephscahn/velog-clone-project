import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'follow' })
export class Follow extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_id' })
  follower: number;

  @ManyToOne((type) => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followee_id' })
  followee: number;
}
