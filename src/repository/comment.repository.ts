import { CommentsDto } from 'src/dto/comment/comments.dto';
import { Comments } from 'src/entity/comment.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Comments)
export class CommentRepository extends Repository<Comments> {
  async selectCommentList(post_id: number, login_user_id: number) {
    const comments = this.query(
      `WITH nested_comments AS (
      SELECT
        child.parent_id,
        JSON_ARRAYAGG(
           JSON_OBJECT(
              'user_id', user.id,
              'comment_login_id', user.login_id,
              'comment_profile_image', user.profile_image,
              'comment_id', child.id,
              'content', child.content,
              'create_at', child.create_at,
              'is_comments_writer', IF(user.id = ?, 1, 0)
            )
        ) AS nested_comments
        FROM (SELECT
          ROW_NUMBER() OVER(ORDER BY create_at DESC) as rownum, 
          id, 
          user_id, 
          content,
          create_at, 
          parent_id 
          FROM comments
          ORDER BY create_at DESC) as child
        INNER JOIN comments parent ON parent.id = child.parent_id
        LEFT JOIN user ON user.id = child.user_id
        GROUP BY parent.id
        ORDER BY child.create_at DESC
      )
      
      SELECT 
      post.id AS post_id,
      user.id AS user_id,
      user.login_id AS comment_login_id,
      user.profile_image AS comment_profile_image,
      comments.id AS comment_id,
      comments.content,
      comments.create_at,
      nested_comments.nested_comments,
      IF(user.id = ?, 1, 0) AS is_comments_writer
      FROM comments
      LEFT JOIN post ON post.id = comments.post_id 
      LEFT JOIN user ON user.id=comments.user_id  
      LEFT JOIN nested_comments ON nested_comments.parent_id=comments.id
      WHERE post.id = ?
      AND comments.parent_id IS NULL 
      ORDER BY comments.create_at DESC`,
      [login_user_id, login_user_id, post_id],
    );

    return comments;
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
