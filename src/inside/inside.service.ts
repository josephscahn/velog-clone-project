import { Injectable } from '@nestjs/common';
import { CommentService } from 'src/comment/comment.service';
import { PostService } from 'src/post/post.service';
import { TagService } from 'src/tag/tag.service';

@Injectable()
export class InsideService {
  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private tagService: TagService,
  ) {}

  async getInsidePage(user_id: number, tag_id: number) {
    const posts = await this.postService.selectPostList(user_id, tag_id);
    const tags = await this.tagService.selectTagListByUserId(user_id);

    return { posts, tags };
  }

  async getPostDetail(user_id: number, post_id: number) {
    const post = await this.postService.selectPostOne(user_id, post_id);
    const comments = await this.commentService.selectCommentList(
      post_id,
      user_id,
    );

    return {
      post,
      comments,
    };
  }

  async getSeries(user_id: number) {
    // 시리즈 들고오는 것
  }

  async getAbout(user_id: number) {
    // 소개 들고오는 것
  }
}
