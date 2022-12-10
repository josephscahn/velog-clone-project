import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';
import { User } from 'src/entity/user.entity';
import { PostTagRepository } from 'src/repository/post-tag.repository';
import { PostRepository } from 'src/repository/post.repository';
import { UserRepository } from 'src/repository/user.repository';

@Injectable()
export class LologService {
  constructor(
    private postRepository: PostRepository,
    private postTagRepository: PostTagRepository,
    private userRepository: UserRepository,
  ) {}

  async getLolog(user_id: number, pagination: PaginationDto, user?: User) {
    let login_user_id = -1;

    if (user != null) {
      login_user_id = user['sub'];
    }

    let is_owner = false;

    if (user_id === login_user_id) {
      is_owner = true;
    }

    const get_me = await this.userRepository.getMe(user_id);
    let posts = await this.postRepository.selectPostList(user_id, is_owner, pagination);
    const tags = await this.postTagRepository.selectTagListByUserId(user_id);

    if (posts.length != 0) {
      for (let i = 0; i < posts.length; i++) {
        if (posts[i].tags) {
          const to_json = JSON.parse(posts[i].tags);

          posts[i].tags = to_json;
        }
      }
    } else {
      posts = null;
    }

    return { user: get_me[0], posts, tags };
  }
}
