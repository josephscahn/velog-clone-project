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

  async getUserProfileImage(user_id: number) {
    return await this.query(
      `
        SELECT user.profile_image FROM user WHERE user.id = ?;
      `,
      [user_id],
    );
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

  async getMe(id: number, login_user_id: number) {
    let getMe = await this.createQueryBuilder('user')
      .leftJoin('social_info', 'social_info', 'social_info.user = user.id')
      .leftJoin('follow', 'follow', 'follow.followee_id = user.id')
      .select([
        'count(follow.id) AS follow_count',
        'user.id',
        'user.profile_image',
        'user.name',
        'user.about_me',
        'user.title',
        'user.email',
        'user.comment_alert',
        'user.update_alert',
        'social_info.email AS social_info_email',
        'social_info.github AS social_info_github',
        'social_info.twitter AS social_info_twitter',
        'social_info.facebook AS social_info_facebook',
        'social_info.url AS social_info_url',
        'IF(user.id = :login_user_id, 1, 0) AS is_owner',
      ])
      .setParameter('login_user_id', login_user_id)
      .where('user.id = :id', { id: id });

    if (login_user_id > -1) {
      getMe
        .addSelect(['IF(follow.follower_id = :user_id, 1, 0) AS is_follower'])
        .setParameter('user_id', login_user_id);
    }
    return await getMe.getRawOne();
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
