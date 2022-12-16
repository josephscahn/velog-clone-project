import { BadRequestException, Injectable } from '@nestjs/common';
import { SelectMainPostsDto } from 'src/dto/main/select-main-posts.dto';
import { User } from 'src/entity/user.entity';
import { PostRepository } from 'src/repository/post.repository';
import { MainPostsType } from './main.model';

@Injectable()
export class MainService {
  constructor(private postRepository: PostRepository) {}

  async getMainPosts(query: SelectMainPostsDto, user: User) {
    if (query.type === 'follow' && !user) {
      throw new BadRequestException('로그인 한 유저만 팔로우 확인 가능');
    }
    const posts = await this.postRepository.selectPostListForMain(
      query.type,
      query.period,
      query.offset,
      query.limit,
      user,
    );

    return posts;
  }
}
