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
export class Comments extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @ManyToOne((type) => Comments)
  @JoinColumn({ name: 'parent_id' })
  comment: number;

  @ManyToOne((type) => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: number;

  @ManyToOne((type) => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: number;
}
