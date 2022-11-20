import { Injectable } from '@nestjs/common';
import { SocialInfoDto } from 'src/dto/user/update-user.dto';
import { SocialInfoRepository } from 'src/repository/social-info.repository';
import { UserRepository } from 'src/repository/user.repository';
import { Connection } from 'typeorm';

@Injectable()
export class UserService {
  private userRepository: UserRepository;
  private socialInfoRepository: SocialInfoRepository;
  constructor(private readonly connection: Connection) {
    this.userRepository = this.connection.getCustomRepository(UserRepository);
    this.socialInfoRepository =
      this.connection.getCustomRepository(SocialInfoRepository);
  }

  async findOne(login_id: string) {
    return this.userRepository.findByLogin(login_id);
  }

  //(name && about_me) || (title) || (comment_alert && update_alert) || (profile_image)
  async updateUser(id: number, updateData: object) {
    const keys = Object.keys(updateData);

    await this.userRepository.updateUser(id, updateData);
    return await this.userRepository.getUserByUserId(id, keys);
  }

  //(social_info_email && social_info_github && social_info_twitter && social_info_facebook && social_info_url)
  async updateSociaInfo(id: number, socialInfoDto: SocialInfoDto) {
    await this.socialInfoRepository.updateSocialInfo(id, socialInfoDto);

    const keys: string[] = Object.keys(socialInfoDto);

    return await this.socialInfoRepository.getSocialInfoByUserId(id, keys);
  }

  async updateProfileImage(id: number, profile_image: string) {
    await this.userRepository.updateProfileImage(id, profile_image);

    return this.userRepository.getUserByUserId(id, ['profile_image']);
  }
}
