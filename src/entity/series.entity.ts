import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { PostSeries } from './post-series.entity';
import { User } from './user.entity';

@Entity({ name: 'series' })
@Unique(['series_name'])
export class Series {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  series_name: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ default: 0 })
  post_count: number;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @ManyToOne((type) => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: number;

  @OneToMany((type) => PostSeries, (post_series) => post_series.series)
  @JoinTable({
    joinColumn: {
      name: 'post_series',
      referencedColumnName: 'series_id',
    },
    inverseJoinColumn: {
      name: 'series',
      referencedColumnName: 'id',
    },
  })
  post_series: PostSeries;
}
