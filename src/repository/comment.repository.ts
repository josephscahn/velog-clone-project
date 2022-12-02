import { CommentsDto } from 'src/dto/comment/comments.dto';
import { Comments } from 'src/entity/comment.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Comments)
export class CommentRepository extends Repository<Comments> {
  async selectCommentList(post_id: number, login_user_id: number) {
    const comments = this.createQueryBuilder('comments')
      .leftJoin('post', 'post', 'post.id = comments.post_id')
      .leftJoin('comments.user', 'user')
      .leftJoin('comments.nested_comments', 'nested_comments')
      .select([
        'post.id AS post_id',
        'user.id AS user_id',
        'user.login_id AS comment_login_id',
        'user.profile_image AS comment_profile_image',
        'comments.id AS comment_id',
        'comments.content as content',
        'comments.create_at as create_at',
        'nested_comments.nested_comments as nested_comments',
        'IF(user.id = :user_id, 1, 0) AS is_comments_writer',
      ])
      .setParameter('user_id', login_user_id)
      .where('post.id = :post_id', { post_id: post_id })
      .andWhere('comments.parent_id IS NULL')
      .orderBy('comments.create_at', 'DESC');

    return await comments.getRawMany();
  }

  async createComment(data: CommentsDto, post_id: number, user_id: number) {
    const comment = this.create({
      user: user_id,
      post: post_id,
      content: data.content,
      comment: data.parent_id,
    });

    await this.save(comment);
  }

  async updateComment(data: CommentsDto, comment_id: number, user_id: number) {
    const comment = this.createQueryBuilder()
      .update(Comments)
      .set({
        content: data.content,
      })
      .where(`id = :comment_id AND user_id = :user_id`, {
        comment_id: comment_id,
        user_id: user_id,
      });

    await comment.execute();
  }

  async deleteComment(comment_id: number, user_id: number) {
    const comment = this.createQueryBuilder()
      .delete()
      .from(Comments)
      .where(`id = :comment_id AND user_id = :user_id`, {
        comment_id: comment_id,
        user_id: user_id,
      });

    await comment.execute();
  }
}
