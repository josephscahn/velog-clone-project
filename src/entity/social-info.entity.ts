import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'social_info' })
export class SocialInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  github: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  url: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
