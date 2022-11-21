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

  @ManyToOne((type) => Tag)
  @JoinColumn({ name: 'tag_id' })
  tag: number;

  @ManyToOne((type) => Post)
  @JoinColumn({ name: 'post_id' })
  post: number;
}
