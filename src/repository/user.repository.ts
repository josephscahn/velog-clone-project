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
    });
    await this.save(user);
  }

  async updateUser(id: number, updateData: object) {
    await this.createQueryBuilder()
      .update()
      .set(updateData)
      .where('id = :id', { id })
      .execute();
  }

  async getUserByUserId(id: number, keys: string[]) {
    return await this.createQueryBuilder()
      .select(keys)
      .where('id = :id', { id })
      .execute();
  }

  async updateProfileImage(id: number, profile_image: string) {
    await this.createQueryBuilder()
      .update()
      .set({ profile_image })
      .where('id = :id', { id })
      .execute();
  }

  async getMe(id: number) {
    return await this.query(
      `
        SELECT u.id, u.profile_image, u.name, u.about_me, u.title, u.email, u.comment_alert, u.update_alert, si.email social_info_email, si.github social_info_github, si. twitter social_info_twitter, si.facebook social_info_facebook, si.url social_info_url
          FROM user u
          LEFT JOIN social_info si ON si.userId = u.id
          WHERE u.id = ?;
      `,
      [id],
    );
  }
}
