import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'series' })
@Unique(['series_name'])
export class Series {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  series_name: string;

  @Column({ default: 0 })
  post_count: number;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  user: number;
}
