import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity({ name: 'comments' })
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ type: 'tinyint', default: 0 })
  depth: number;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @ManyToOne((type) => Comment)
  @JoinColumn({ name: 'paren_id' })
  comment: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  user: number;

  @ManyToOne((type) => Post)
  @JoinColumn({ name: 'post_id' })
  post: number;
}