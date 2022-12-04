import { BadRequestException, Injectable } from '@nestjs/common';
import { SelectMainPostsDto } from 'src/dto/main/select-main-posts.dto';
import { PostRepository } from 'src/repository/post.repository';
import { MainPostsType } from './main.model';

@Injectable()
export class MainService {
  constructor(private postRepository: PostRepository) {}

  async getMainPosts(query: SelectMainPostsDto) {
    if (query.type == MainPostsType.TREND && !query.period) {
      throw new BadRequestException(
        `트랜딩을 조회할 땐 period가 필수 값 입니다.`,
      );
    }

    const posts = await this.postRepository.selectPostListForMain(
      query.type,
      query.period,
      query.offset,
      query.limit,
    );

    return posts;
  }
}
