import { CreateSocialUserDto } from 'src/dto/user/create-social-user.dto';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { User } from 'src/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async checkEmail(email: string) {
    const user = await this.findOne({ email });
    return user;
  }

  async checkLoginId(login_id: string) {
    const user = await this.findOne({ login_id });
    return user;
  }

  async findByLogin(user_id) {
    return await this.findOne({ id: user_id });
  }

  async signupWithEmail(createUserDto: CreateUserDto, hashedPassword: string) {
    const { email, name, about_me, login_id } = createUserDto;
    const user = this.create({
      email,
      name,
      password: hashedPassword,
      login_id,
      about_me,
      title: login_id + '.log',
    });
    return await this.save(user);
  }

  async signupWithSocial(createSocialUserDto: CreateSocialUserDto) {
    const { name, email, login_id, about_me, provider, profile_image } = createSocialUserDto;
    const user = this.create({
      name,
      email,
      login_id,
      about_me,
      provider,
      profile_image,
      title: login_id + '.log',
    });

    return await this.save(user);
  }

  async updateUser(id: number, updateData: object) {
    await this.createQueryBuilder().update().set(updateData).where('id = :id', { id }).execute();
  }

  async getUserByUserId(id: number, keys: string[]) {
    return await this.createQueryBuilder().select(keys).where('id = :id', { id }).execute();
  }

  async updateProfileImage(id: number, profile_image: string) {
    await this.createQueryBuilder()
      .update()
      .set({ profile_image })
      .where('id = :id', { id })
      .execute();
  }

  async deleteProfileImage(id: number) {
    await this.createQueryBuilder()
      .update()
      .set({ profile_image: null })
      .where('id = :id', { id })
      .execute();
  }

  async getMe(id: number) {
    return await this.query(
      `
      SELECT count(follow.id) as follow_count, u.id, u.profile_image, u.name, u.about_me, u.title, u.email, u.comment_alert, u.update_alert, si.email social_info_email, si.github social_info_github, si. twitter social_info_twitter, si.facebook social_info_facebook, si.url social_info_url
        FROM user u
        LEFT JOIN social_info si ON si.userId = u.id
        LEFT JOIN follow ON u.id = follow.followee_id
        WHERE u.id = ?;
      `,
      [id],
    );
  }

  async updateAboutBlog(user_id: number, about_blog: string) {
    await this.createQueryBuilder()
      .update()
      .set({ about_blog: about_blog })
      .where('id = :user_id', { user_id: user_id })
      .execute();
  }

  async selectAboutBlog(user_id: number, login_user_id: number) {
    const about_blog = this.createQueryBuilder('user')
      .select([
        'user.id AS user_id',
        'user.about_blog AS about_blog',
        'IF(`user`.`id` = :login_user_id, 1, 0) AS is_owner',
      ])
      .setParameter('login_user_id', login_user_id)
      .where('user.id = :user_id', { user_id: user_id });
    return await about_blog.getRawMany();
  }

  async withdrawal(user_id: number) {
    await this.createQueryBuilder().delete().where('id = :user_id', { user_id }).execute();
  }
}
