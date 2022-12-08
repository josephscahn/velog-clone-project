import { BadRequestException, Injectable } from '@nestjs/common';
import { SelectMainPostsDto } from 'src/dto/main/select-main-posts.dto';
import { PostRepository } from 'src/repository/post.repository';
import { MainPostsType } from './main.model';

@Injectable()
export class MainService {
  constructor(private postRepository: PostRepository) {}

  async getMainPosts(query: SelectMainPostsDto) {
    const posts = await this.postRepository.selectPostListForMain(
      query.type,
      query.period,
      query.offset,
      query.limit,
    );

    return posts;
  }
}
