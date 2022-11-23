import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SocialInfoDto } from 'src/dto/user/update-user.dto';
import { FollowRepository } from 'src/repository/follow.repository';
import { SocialInfoRepository } from 'src/repository/social-info.repository';
import { UserRepository } from 'src/repository/user.repository';
import { Connection } from 'typeorm';

@Injectable()
export class UserService {
  private userRepository: UserRepository;
  private socialInfoRepository: SocialInfoRepository;
  private followRepository: FollowRepository;
  constructor(private readonly connection: Connection) {
    this.userRepository = this.connection.getCustomRepository(UserRepository);
    this.socialInfoRepository =
      this.connection.getCustomRepository(SocialInfoRepository);
    this.followRepository =
      this.connection.getCustomRepository(FollowRepository);
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

  async follow(followerId: number, followeeId: number) {
    if (followerId === followeeId) {
      throw new BadRequestException('Cannot follow yourself');
    }
    const user = await this.userRepository.findByLogin(followeeId);
    if (!user) {
      throw new NotFoundException('Not Found UserId');
    }

    const data = await this.followRepository.checkFollow(
      followerId,
      followeeId,
    );
    if (data) {
      throw new ConflictException('Already follow');
    }
    await this.followRepository.follow(followerId, followeeId);
  }

  async unfollow(followerId: number, followeeId: number) {
    if (followerId === followeeId) {
      throw new BadRequestException('Cannot follow yourself');
    }
    const user = await this.userRepository.findByLogin(followeeId);
    if (!user) {
      throw new NotFoundException('Not Found UserId');
    }
    const data = await this.followRepository.checkFollow(
      followerId,
      followeeId,
    );
    if (!data) {
      throw new ConflictException('Already unfollow');
    }

    await this.followRepository.unfollow(followerId, followeeId);
  }

  async getMyFollowee(id: number) {
    const data = await this.followRepository.getMyFollow(id);
    const returnData = [];
    for (let i = 0; i < data.length; i++) {
      data[i].follow = JSON.parse(data[i].follow);
      returnData.push(data[i].follow);
    }
    return returnData;
  }

  async getMe(id: number) {
    return await this.userRepository.getMe(id);
  }
}
