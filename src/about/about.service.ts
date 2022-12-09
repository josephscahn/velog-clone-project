import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { UserRepository } from 'src/repository/user.repository';

@Injectable()
export class AboutService {
  constructor(private userRepository: UserRepository) {}

  async getAboutBlog(user_id: number, user?: User) {
    let login_user_id = -1;

    if (user != null) {
      login_user_id = user['sub'];
    }

    const about = await this.userRepository.selectAboutBlog(user_id, login_user_id);
    return about[0];
  }

  async editAboutBlog(about_blog: string, user: User) {
    await this.userRepository.updateAboutBlog(user.id, about_blog);

    return await this.getAboutBlog(user.id);
  }
}
