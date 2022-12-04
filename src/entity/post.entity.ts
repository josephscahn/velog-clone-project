import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { PostSeries } from './post-series.entity';
import { PostTag } from './post-tag.entity';
import { User } from './user.entity';
import { TagsView } from './view-tags.entity';

@Entity({ name: 'post' })
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 3000 })
  content: string;

  @Column({ type: 'tinyint' })
  status: number;

  @Column({ length: 3000, nullable: true })
  thumbnail: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  comment_count: number;

  @Column()
  post_url: string;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @ManyToOne((type) => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany((type) => PostTag, (post_tag) => post_tag.post, { cascade: true })
  @JoinTable({
    joinColumn: {
      name: 'post_tag',
      referencedColumnName: 'post_id',
    },
    inverseJoinColumn: {
      name: 'post',
      referencedColumnName: 'id',
    },
  })
  post_tag: PostTag[];

  @OneToMany((type) => TagsView, (tags) => tags.post)
  @JoinTable({
    joinColumn: {
      name: 'tags',
      referencedColumnName: 'post_id',
    },
    inverseJoinColumn: {
      name: 'post',
      referencedColumnName: 'id',
    },
  })
  tags: TagsView;
}
