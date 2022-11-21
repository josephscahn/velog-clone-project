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

  // async readPost(user: User, post_id: number) {
  //   const post = await this.postRepository.selectPostOne(post_id);

  //   let is_writer: boolean = false;

  //   if (user.id == post[0].user_id) is_writer = true;

  //   return { post, is_writer };
  // }

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

  // velogController 따로 구성하여 해당 기능 분리할 예정.
  //   async selectPostList(
  //     user: User,
  //     user_id: number,
  //     status: number,
  //     tag: string,
  //   ) {
  //     // user에서 받아온 id랑 param으로 넘어온 user_id 비교해서 일치 = is_writer:true 하면 임시 글을 제외한 나머지 글 다 보여주기.
  //     // 일치하지 않으면 is_writer: false  공개글 목록만 보여주기
  //     // 태그 선택하면 태그id랑 일치한 것 보여주기
  //     /*
  //     -> 필요한 것
  //     제목
  //     login_id
  //     작성일
  //     공개여부
  //     태크
  //     이전포스트
  //     다음포스트
  //     */
  //     let is_writer: boolean = false;
  //     if(user_id == user.id)
  //       is_writer = true;

  //     return await this.postRepository.selectPostList(is_writer, status, tag);
  //   }
}
