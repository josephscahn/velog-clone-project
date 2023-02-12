import { BaseEntity, BeforeInsert, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import * as bcryptjs from 'bcryptjs';

@Entity({ name: 'user' })
@Unique(['email'])
@Unique(['login_id'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
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
  about_blog: string;

  @Column({ nullable: true })
  about_me: string;

  @Column({ nullable: true })
  title: string;

  @Column({ default: 0 })
  comment_alert: number;

  @Column({ default: 0 })
  update_alert: number;

  @Column({ nullable: true })
  provider: string;

  @BeforeInsert()
  hashPassword() {
    if (this.password) {
      this.password = bcryptjs.hashSync(this.password, 10);
    }
  }
}
