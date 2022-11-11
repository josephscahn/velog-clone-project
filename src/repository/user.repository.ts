import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { User } from 'src/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async checkEmail(email: string) {
    return await this.findOne({ email });
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
}
