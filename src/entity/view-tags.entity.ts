import { ViewColumn, ViewEntity, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';

@ViewEntity({
  expression: `
    SELECT
	post.id AS post_id,
    post.user_id,
    JSON_ARRAYAGG(
      JSON_OBJECT(
         'tag_id', tag.id,
         'tag_name', tag.name
      )
    ) AS tags
    FROM post
    LEFT JOIN post_tag pt ON pt.post_id = post.id
    LEFT JOIN tag ON tag.id = pt.tag_id
    GROUP BY post.id;
    `,
})
export class TagsView {
  @ManyToOne((type) => Post)
  @JoinColumn({ name: 'post_id' })
  post: number;

  @ViewColumn()
  user_id: number;

  @ViewColumn()
  tags: string[];
}
