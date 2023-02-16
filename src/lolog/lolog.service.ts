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
      login_user_id = user.id;
    }

    let get_me = await this.userRepository.getMe(user_id, login_user_id);
    if (login_user_id >= 0) {
      get_me.is_follower = Number.parseInt(get_me.is_follower);
    }

    let posts = await this.postRepository.selectPostList(user_id, login_user_id, pagination);
    const tags = await this.postTagRepository.selectTagListByUserId(user_id);

    get_me.is_follower = Number.parseInt(get_me.is_follower);
    get_me.is_owner = Number.parseInt(get_me.is_owner);

    if (posts.length != 0) {
      for (let i = 0; i < posts.length; i++) {
        posts[i].is_owner = Number.parseInt(posts[i].is_owner);
        if (posts[i].tags) {
          const to_json = JSON.parse(posts[i].tags);

          posts[i].tags = to_json;
        }
      }
    }

    if (pagination.offset == 1 && posts.length == 0) {
      posts = null;
    }

    return { user: get_me, posts, tags };
  }
}
