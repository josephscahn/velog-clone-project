import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'board'})
export class Board extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 200})
  title: string;

  @Column({length: 3000})
  content: string;

  @Column({type: "tinyint"})
  status: number

  @Column({length: 3000})
  thumbnail: string;

  @Column({default: 0})
  views: number;

  @Column({default: 0})
  likes: number;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @ManyToOne(type => User, user => user.id)
  user: User
}