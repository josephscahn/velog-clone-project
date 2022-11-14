import { ForbiddenException } from '@nestjs/common';
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
}
