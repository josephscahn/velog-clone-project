import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Post } from './post.entity';
import { Tag } from './tag.entity';

@Entity({ name: 'post_tag' })
export class PostTag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Tag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag: number;

  @ManyToOne((type) => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: number;
}
