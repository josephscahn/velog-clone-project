import { Injectable } from '@nestjs/common';
import { PostService } from 'src/post/post.service';

@Injectable()
export class MainService {
  constructor(private postService: PostService) {}

  async getMainPosts(type: string, period: string) {
    const posts = await this.postService.selectPostListForMain(type, period);

    return posts;
  }
}
