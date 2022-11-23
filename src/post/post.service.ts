import { Injectable } from '@nestjs/common';
import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { UpdatePostDto } from 'src/dto/post/update-post.dto';
import { User } from 'src/entity/user.entity';
import { PostRepository } from 'src/repository/post.repository';
import { TagService } from 'src/tag/tag.service';

/**
 * @todo 게시글 삭제 시에 tag 테이블의 post_count 관련 기능은 추후 구현할 예정..
 * -> 현재는 post_tag 테이블 삭제까지만 구현되어 있음
 */

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    private tagService: TagService,
  ) {}

  async createPost(user: User, data: CreatePostDto, status: number) {
    const create_post = await this.postRepository.createPost(
      user,
      data,
      status,
    );

    if (data.tags.length > 0)
      await this.tagService.tagAction(data.tags, create_post, user.id);

    const post = await this.postRepository.selectPostOne(user.id, create_post);

    return { post, create_post };
  }

  async selectPostOne(user_id: number, post_id: number) {
    const post = await this.postRepository.selectPostOne(user_id, post_id);

    for (let i = 0; i < post.length; i++) {
      if (post[i].tags) {
        const to_json = JSON.parse(post[i].tags);

        post[i].tags = to_json;
      }
    }

    const next_post = await this.postRepository.selectNextPost(post_id);
    const pre_post = await this.postRepository.selectPrePost(post_id);

    return { post, next_post, pre_post };
  }

  async updatePost(
    user: User,
    data: UpdatePostDto,
    post_id: number,
    status: number,
  ) {
    await this.postRepository.selectPostOne(user.id, post_id);
    const update_post = await this.postRepository.updatePost(
      user,
      data,
      post_id,
      status,
    );

    if (data.tags.length > 0) {
      await this.tagService.deletePostTag(post_id);
      await this.tagService.tagAction(data.tags, post_id, user.id);
    }

    const post = await this.postRepository.selectPostOne(user.id, post_id);

    return { post, update_post };
  }

  async deletePost(user: User, post_id: number) {
    const post = await this.postRepository.selectPostOne(user.id, post_id);
    await this.tagService.deletePostTag(post_id);
    const delete_post = await this.postRepository.deletePost(user, post_id);
    return { post, delete_post };
  }

  async selectPostList(user_id: number, tag_id: number) {
    const posts = await this.postRepository.selectPostList(
      user_id,
      false,
      tag_id,
    );

    for (let i = 0; i < posts.length; i++) {
      if (posts[i].tags) {
        const to_json = JSON.parse(posts[i].tags);

        posts[i].tags = to_json;
      }
    }

    return posts;
  }
}
