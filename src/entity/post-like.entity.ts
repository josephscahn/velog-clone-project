import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity({ name: 'post_like' })
export class PostLike extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  user: number;

  @ManyToOne((type) => Post)
  @JoinColumn({ name: 'post_id' })
  post: number;

  @CreateDateColumn()
  create_at: Date;
}
