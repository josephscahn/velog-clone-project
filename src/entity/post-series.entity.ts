import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { Series } from './series.entity';

@Entity({ name: 'post_series' })
export class PostSeries {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Series)
  @JoinColumn({ name: 'series_id' })
  series: number;

  @ManyToOne((type) => Post)
  @JoinColumn({ name: 'post_id' })
  post: number;

  @Column({ default: 1 })
  sort: number;
}
