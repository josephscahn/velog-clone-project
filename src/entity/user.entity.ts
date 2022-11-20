import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany
} from 'typeorm';
import { Board } from './board.entity';

@Entity({ name: 'user' })
@Unique(['email'])
@Unique(['login_id'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 15 })
  login_id: string;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  about_me: string;

  @Column({ nullable: true })
  title: string;

  @Column({ default: 0 })
  comment_alert: number;

  @Column({ default: 0 })
  update_alert: number;

  @OneToMany(type => Board, board => board.user)
  boards: Board[]

}
