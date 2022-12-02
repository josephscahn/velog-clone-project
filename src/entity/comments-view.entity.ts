import { JoinColumn, ManyToOne, ViewColumn, ViewEntity } from 'typeorm';
import { Comments } from './comment.entity';

@ViewEntity({
  expression: `SELECT
  child.parent_id,
  JSON_ARRAYAGG(
      JSON_OBJECT(
          'user_id', user.id,
        'comment_login_id', user.login_id,
        'comment_profile_image', user.profile_image,
        'comment_id', child.id,
        'content', child.content,
        'create_at', child.create_at,
        'is_comments_writer', IF(user.id = 1, 'true', 'false')
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
  ORDER BY child.create_at DESC;
  `,
})
export class NestedCommentsView {
  @ManyToOne((type) => Comments)
  @JoinColumn({ name: 'parent_id' })
  comment: number;

  @ViewColumn()
  nested_comments: string[];
}
