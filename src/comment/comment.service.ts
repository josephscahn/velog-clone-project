import { Injectable } from '@nestjs/common';
import { CommentDto } from 'src/dto/comment/comment.dto';
import { PostService } from 'src/post/post.service';
import { CommentRepository } from 'src/repository/comment.repository';
import { PostRepository } from 'src/repository/post.repository';

@Injectable()
export class CommentService {
  constructor(
    private commentRepository: CommentRepository,
    private postRepository: PostRepository,
    private postService: PostService,
  ) {}

  async selectCommentList(post_id: number, user_id: number) {
    let result = await this.commentRepository.selectCommentList(
      post_id,
      user_id,
    );

    for (let i = 0; i < result.length; i++) {
      if (result[i].nested_comments) {
        const to_json = JSON.parse(result[i].nested_comments);

        result[i].nested_comments = to_json;
      }
    }

    return result;
  }

  async createComment(data: CommentDto, post_id: number, user_id: number) {
    if (data.depth == 1 && !data.parent_id) return 0;

    const result = await this.commentRepository.createComment(
      data,
      post_id,
      user_id,
    );

    if (result == 0) return 0;

    await this.postRepository.updateCommentCount(post_id);

    const comments = await this.selectCommentList(post_id, user_id);
    const post = await this.postService.selectPostOne(user_id, post_id);

    return { post, comments };
  }

  async updateComment(
    data: CommentDto,
    comment_id: number,
    post_id: number,
    user_id: number,
  ) {
    const result = await this.commentRepository.updateComment(
      data,
      comment_id,
      user_id,
    );

    if (result == 0) return 0;

    const comments = await this.selectCommentList(post_id, user_id);
    const post = await this.postService.selectPostOne(user_id, post_id);

    return { post, comments };
  }

  async deleteComment(comment_id: number, post_id: number, user_id: number) {
    const result = await this.commentRepository.deleteComment(
      comment_id,
      user_id,
    );

    if (result == 0) return 0;

    await this.postRepository.updateCommentCount(post_id);

    const comments = await this.selectCommentList(post_id, user_id);
    const post = await this.postService.selectPostOne(user_id, post_id);

    return { post, comments };
  }
}
