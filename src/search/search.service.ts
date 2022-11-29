import { Injectable } from '@nestjs/common';
import { PostRepository } from 'src/repository/post.repository';

@Injectable()
export class SearchService {
  constructor(private postRepository: PostRepository) {}

  async mainSearch(keyword: string, user_id: number) {
    let keywords: string = keyword.split(' ').join('|');
    const searchPosts = await this.postRepository.mainSearch(keywords, user_id);

    for (let i = 0; i < searchPosts.length; i++) {
      searchPosts[i].tags = JSON.parse(searchPosts[i].tags);
    }
    const postCount: number = searchPosts.length;
    return { searchPosts, postCount };
  }
}
