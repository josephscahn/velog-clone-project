import { Injectable } from '@nestjs/common';
import { CommentDto } from 'src/dto/comment/comment.dto';
import { CommentRepository } from 'src/repository/comment.repository';

@Injectable()
export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  async createComment(data: CommentDto, post_id: number, user_id: number) {
    if (data.depth == 1 && !data.parent_id) return 0;

    const result = await this.commentRepository.createComment(
      data,
      post_id,
      user_id,
    );

    return result;
  }

  async updateComment(data: CommentDto, comment_id: number, user_id: number) {
    return await this.commentRepository.updateComment(
      data,
      comment_id,
      user_id,
    );
  }

  async deleteComment(comment_id: number, user_id: number) {
    return await this.commentRepository.deleteComment(comment_id, user_id);
  }

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
}
